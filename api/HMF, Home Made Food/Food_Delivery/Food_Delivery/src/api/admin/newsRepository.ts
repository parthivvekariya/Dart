import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { GetCommand, GetCommandInput, ScanCommand, ScanCommandInput } from '@aws-sdk/lib-dynamodb';

import { News, TABLE_NAME } from '@/api/admin/newsModel';
import { docClient } from '@/common/helpers/database';
import { formatDynamoDBRecord } from '@/common/utils/dynamoDbFormatter';
import { logger } from '@/server';

export const newsRepository = {
  findAllAsync: async (): Promise<News[] | null> => {
    let news: News[] = [];
    let lastEvaluatedKey = undefined;

    do {
      const scanCommandInput: ScanCommandInput = {
        TableName: TABLE_NAME,
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const result = await docClient.send(new ScanCommand(scanCommandInput));
      news = news.concat(result.Items as News[]);
      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return news;
  },

  findByIdAsync: async (id: number): Promise<News | null> => {
    const params: GetCommandInput = {
      TableName: TABLE_NAME,
      Key: { newsId: id },
    };

    try {
      const command = new GetCommand(params);
      const result = await docClient.send(command);

      if (result.Item) {
        return result.Item as News;
      } else {
        logger.info(`No news found with id: ${id}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error fetching news with id ${id}:`, error);
      throw error; // or handle it as per your error handling strategy
    }
  },

  createAsync: async (news: News): Promise<News> => {
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: formatDynamoDBRecord(news),
    });

    try {
      await docClient.send(command);
      return news;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
