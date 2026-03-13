import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AIService } from '../services/ai.service';
import { AddTextDto, QueryDto, ChatHistoryDto } from '../dto/chat.dto';
import { GetUser } from 'src/common/decorators/info.decorator';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AIService) {}

  @Post('add-text')
  @ApiOperation({ summary: 'Add text to vector database' })
  @ApiResponse({ status: 200, description: 'Text added successfully' })
  async addText(@Body() body: AddTextDto) {
    return await this.aiService.addText(body.text);
  }

  @Post('query')
  @ApiOperation({ summary: 'Query AI with context' })
  @ApiResponse({ status: 200, description: 'Query processed successfully' })
  async query(
    @GetUser() user: Partial<{ _id: string }>,
    @Body() body: QueryDto,
  ) {
    return await this.aiService.getText(
      body.query,
      user._id!,
      body.sessionId || '',
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({
    status: 200,
    description: 'Chat history retrieved successfully',
  })
  async getHistory(
    @GetUser() user: Partial<{ _id: string }>,
    @Query() query: ChatHistoryDto,
  ) {
    return await this.aiService.getChatHistory(
      query.sessionId,
      user._id,
      query.limit,
    );
  }

  @Delete('history/:sessionId')
  @ApiOperation({ summary: 'Clear chat history for a session' })
  @ApiResponse({
    status: 200,
    description: 'Chat history cleared successfully',
  })
  async clearHistory(@Param('sessionId') sessionId: string) {
    return await this.aiService.clearChatHistory(sessionId);
  }
}
