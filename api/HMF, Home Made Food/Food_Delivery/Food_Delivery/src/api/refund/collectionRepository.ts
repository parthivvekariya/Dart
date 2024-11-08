import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';

import { Collection, TABLE_NAME } from '@/api/refund/collectionModel';
import { docClient } from '@/common/helpers/database';
import { logger } from '@/server';

const PRICE_INDEX_NAME = 'PriceSortIndex';
const DATE_INDEX_NAME = 'DateSortIndex';
type SortBy = 'price' | 'date';

export const collectionRepository = {
  findAllAsync: async (
    sortBy: SortBy | string = 'price',
    limit?: number,
    offset?: { collectionId: string; lastTradedPrice?: number; createdAt?: string }
  ): Promise<Collection[]> => {
    const indexName = sortBy === 'price' ? PRICE_INDEX_NAME : DATE_INDEX_NAME;
    const sortKeyName = sortBy === 'price' ? 'lastTradedPrice' : 'createdAt';
    const params: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: indexName,
      KeyConditionExpression: '#tradingStatus = :tradingStatus',
      ExpressionAttributeNames: {
        '#tradingStatus': 'tradingStatus',
      },
      ExpressionAttributeValues: {
        ':tradingStatus': 'ACTIVE',
      },
      ScanIndexForward: false, // false for descending order
      Limit: limit,
      ExclusiveStartKey: offset
        ? {
            tradingStatus: 'ACTIVE',
            collectionId: offset.collectionId,
            [sortKeyName]: offset[sortKeyName],
          }
        : undefined,
    };

    try {
      const command = new QueryCommand(params);
      const result = await docClient.send(command);

      if (result.Items) {
        return result.Items as Collection[];
      } else {
        logger.info('No items found');
        return [];
      }
    } catch (error) {
      logger.error('Error fetching items:', error);
      throw error;
    }
  },

  findLatestMints: async (): Promise<Collection[]> => {
    const queryCommandInput: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: DATE_INDEX_NAME,
      KeyConditionExpression: '#tradingStatus = :tradingStatus',
      ExpressionAttributeNames: {
        '#tradingStatus': 'tradingStatus',
      },
      ExpressionAttributeValues: {
        ':tradingStatus': 'ACTIVE',
      },
      ScanIndexForward: false, // This will sort in descending order (newest first)
      Limit: 10,
    };

    const result = await docClient.send(new QueryCommand(queryCommandInput));

    return result.Items as Collection[];
  },

  findByIdAsync: async (id: string): Promise<Collection | null> => {
    const params: GetCommandInput = {
      TableName: TABLE_NAME,
      Key: { collectionId: id },
    };

    try {
      const command = new GetCommand(params);
      const result = await docClient.send(command);

      if (result.Item) {
        return result.Item as Collection;
      } else {
        logger.info(`No item found with id: ${id}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching item with id ${id}:`, error);
      throw error; // or handle it as per your error handling strategy
    }
  },

  findAllByIdsAsync: async (collectionIds: string[]): Promise<Collection[] | null> => {
    const batchSize = 100;
    let collections: Collection[] = [];

    for (let i = 0; i < collectionIds.length; i += batchSize) {
      const batch = collectionIds.slice(i, i + batchSize);
      const params: BatchGetCommandInput = {
        RequestItems: {
          [TABLE_NAME]: {
            Keys: batch.map((id) => ({ collectionId: id })), // Assume PK is the primary key
          },
        },
      };

      try {
        const command = new BatchGetCommand(params);
        const response = await docClient.send(command);

        if (response.Responses && response.Responses[TABLE_NAME]) {
          collections = collections.concat(response.Responses[TABLE_NAME] as Collection[]);
        }

        // Handle any unprocessed keys
        if (response.UnprocessedKeys && Object.keys(response.UnprocessedKeys).length > 0) {
          console.warn(
            'Collection findAllByIdsAsync: Some items were not processed. You might want to retry these:',
            response.UnprocessedKeys
          );
        }
      } catch (error) {
        console.error('Error fetching collections from DynamoDB:', error);
        // throw error; // Propagate the error
      }
    }

    return collections;
  },

  searchAsync: async (params: any): Promise<QueryCommandOutput> => {
    const { query, sortDirection = 'desc', limit = 20, lastEvaluatedKey } = params;

    const queryParams: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: 'collectionId-createdAt-index',
      KeyConditionExpression: 'collectionId = :collectionId',
      // ExpressionAttributeValues: {
      //   // ':collectionId': 'GLOBAL', // Use a constant value for all collections
      // },
      ScanIndexForward: sortDirection === 'asc', // 'asc' for ascending order
      Limit: limit,
    };

    if (query) {
      queryParams.FilterExpression = 'contains(#tickerName, :searchQuery)';
      queryParams.ExpressionAttributeNames = {
        '#tickerName': 'tickerName',
      };
      queryParams.ExpressionAttributeValues![':searchQuery'] = query;
    }

    if (lastEvaluatedKey) {
      queryParams.ExclusiveStartKey = lastEvaluatedKey;
    }
    logger.info('Query Params:', JSON.stringify(queryParams, null, 2));

    const command = new QueryCommand(queryParams);
    const result = await docClient.send(command);

    logger.info('Query Result:', JSON.stringify(result, null, 2));
    return result;
  },

  insertRecordAsync: async (item: Record<string, any>): Promise<any> => {
    const params: PutCommandInput = {
      TableName: TABLE_NAME,
      Item: item,
    };

    try {
      const command = new PutCommand(params);
      const result = await docClient.send(command);
      // logger.info('Success - item added or updated', result);
      return result.Attributes;
    } catch (err) {
      logger.error('Error', err);
      throw err;
    }
  },

  updateCollectionToComplete: async (collectionId: string): Promise<void> => {
    const params: UpdateCommandInput = {
      TableName: TABLE_NAME,
      Key: { collectionId },
      UpdateExpression: 'SET complete = :complete',
      ExpressionAttributeValues: {
        ':complete': true,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      const command = new UpdateCommand(params);
      const result = await docClient.send(command);

      logger.info(`Successfully updated collection ${collectionId}:`, result.Attributes);
    } catch (error) {
      logger.error(`Error updating collection ${collectionId}:`, error);
      throw error; // or handle it as per your error handling strategy
    }
  },

  updateCollectionRaydiumPool: async (collectionId: string, poolId: string, marketId: string): Promise<void> => {
    const params: UpdateCommandInput = {
      TableName: TABLE_NAME,
      Key: { collectionId },
      UpdateExpression: 'SET raydiumPool = :poolId, marketId = :marketId',
      ExpressionAttributeValues: {
        ':poolId': poolId,
        ':marketId': marketId,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      const command = new UpdateCommand(params);
      const result = await docClient.send(command);

      logger.info(`Successfully updated collection ${collectionId}:`, result.Attributes);
    } catch (error) {
      logger.error(`Error updating collection ${collectionId}:`, error);
      throw error; // or handle it as per your error handling strategy
    }
  },

  updateCollectionAfterTradeEvent: async (
    collectionId: string,
    solAmount: number,
    timestamp: number,
    lastTokenPrice: number,
    virtualSolReserves: string,
    virtualTokenReserves: string
  ): Promise<void> => {
    try {
      const getParams: GetCommandInput = {
        TableName: TABLE_NAME,
        Key: { collectionId },
      };

      const getResult = await docClient.send(new GetCommand(getParams));
      const currentVolume = getResult?.Item?.tokenVolume ? (getResult.Item as Collection).tokenVolume : 0;
      const newVolume = currentVolume + solAmount;

      const updateParams: UpdateCommandInput = {
        TableName: TABLE_NAME,
        Key: { collectionId },
        UpdateExpression:
          'SET tokenVolume = :volume, lastUpdatedVolumeTimestamp = :timestamp, #tradingStatus = :tradingStatus, #trendingStatus = :trendingStatus, lastTradedPrice = :lastTradedPrice, virtualSolReserves = :virtualSolReserves, virtualTokenReserves = :virtualTokenReserves',
        ExpressionAttributeValues: {
          ':volume': newVolume,
          ':timestamp': timestamp,
          ':tradingStatus': 'ACTIVE',
          ':trendingStatus': 'ACTIVE',
          ':lastTradedPrice': lastTokenPrice,
          ':virtualSolReserves': virtualSolReserves,
          ':virtualTokenReserves': virtualTokenReserves,
        },
        ExpressionAttributeNames: {
          '#tradingStatus': 'tradingStatus',
          '#trendingStatus': 'trendingStatus',
        },
      };

      await docClient.send(new UpdateCommand(updateParams));
      console.log(`Updated volume for token ${collectionId}`);
    } catch (error) {
      console.error('Error processing trade event:', error);
    }
  },

  getTrendingCollections: async (limit: number = 10): Promise<Collection[]> => {
    const queryParams: QueryCommandInput = {
      TableName: TABLE_NAME,
      IndexName: 'VolumeIndex1', // Global Secondary Index
      KeyConditionExpression: '#trendingStatus = :trendingStatus',
      ExpressionAttributeNames: {
        '#trendingStatus': 'trendingStatus',
      },
      ExpressionAttributeValues: {
        ':trendingStatus': 'ACTIVE',
      },
      ScanIndexForward: false, // To get highest volume first
      Limit: limit,
    };

    try {
      const result = await docClient.send(new QueryCommand(queryParams));
      return result.Items as Collection[];
    } catch (error) {
      console.error('Error querying trending tokens:', error);
      throw error;
    }
  },

  decayCollectionVolumes: async (): Promise<void> => {
    const now = Date.now();
    const DECAY_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours
    const DECAY_FACTOR = 0.5;
    const INACTIVITY_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 days
    const BATCH_SIZE = 25; // DynamoDB allows up to 25 items per batch write

    const scanParams: ScanCommandInput = {
      TableName: TABLE_NAME,
      FilterExpression: 'lastUpdatedVolumeTimestamp < :threshold',
      ExpressionAttributeValues: {
        ':threshold': now - DECAY_THRESHOLD,
      },
    };

    try {
      const scanResult = await docClient.send(new ScanCommand(scanParams));
      const items = scanResult.Items as Collection[];

      // Process items in batches
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const batchWriteParams: BatchWriteCommandInput = {
          RequestItems: {
            [TABLE_NAME]: batch.map((item) => ({
              PutRequest: {
                Item: {
                  ...item,
                  tokenVolume: item.tokenVolume * DECAY_FACTOR,
                  lastUpdatedVolumeTimestamp: now,
                  trendingStatus:
                    (now - item?.lastUpdatedVolumeTimestamp ? item?.lastUpdatedVolumeTimestamp : 0) >
                    INACTIVITY_THRESHOLD
                      ? 'INACTIVE'
                      : 'ACTIVE',
                },
              },
            })),
          },
        };

        await docClient.send(new BatchWriteCommand(batchWriteParams));
      }

      console.log('Collection Volume decay completed');
    } catch (error) {
      console.error('Error during volume decay:', error);
    }
  },

  updateTagsAndCaptionAsync: async (collectionId: string, tags: string[], caption: string): Promise<void> => {
    const params: UpdateCommandInput = {
      TableName: TABLE_NAME,
      Key: { collectionId },
      UpdateExpression: 'SET tags = :tags, caption = :caption',
      ExpressionAttributeValues: {
        ':tags': tags,
        ':caption': caption,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    try {
      const command = new UpdateCommand(params);
      const result = await docClient.send(command);

      logger.info(`Successfully updated collection ${collectionId}:`, result.Attributes);
    } catch (error) {
      logger.error(`Error updating collection ${collectionId}:`, error);
      throw error;
    }
  },

  searchByTagsOrCaptionOrTickerNameAsync: async (
    query: string,
    limit?: number,
    offset?: number
  ): Promise<ScanCommandOutput> => {
    try {
      const scanParams: ScanCommandInput = {
        TableName: TABLE_NAME,
        FilterExpression:
          'contains(tags, :searchQuery) OR contains(caption, :searchQuery) OR contains(tickerName, :searchQuery)',
        ExpressionAttributeValues: {
          ':searchQuery': query,
        },
        Limit: limit,
        ExclusiveStartKey: offset ? { collectionId: offset } : undefined,
      };

      const result = await docClient.send(new ScanCommand(scanParams));
      return result;
    } catch (error) {
      console.error('Error querying collections:', error);
      throw error;
    }
  },
};
