import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentResponseDto } from '../dto/comment-response.dto';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentService.create(createCommentDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all comments with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Field to sort by (default: _id)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order (default: desc)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'searchField',
    required: false,
    type: String,
    description: 'Field to search in',
  })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Filter by deleted status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all comments with pagination',
    type: PaginationResponseDto,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.commentService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get comments by blog ID(not deleted)' })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Filter by deleted status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments for blog',
    type: [CommentResponseDto],
  })
  @Get('blog/:blogId')
  findByBlogId(@Param('blogId') blogId: string, @Query('isDeleted') isDeleted?: string) {
    return this.commentService.findByBlogId(blogId, isDeleted);
  }

  @ApiOperation({ summary: 'Get comments by user ID' })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Filter by deleted status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments by user',
    type: [CommentResponseDto],
  })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Query('isDeleted') isDeleted?: string) {
    return this.commentService.findByUserId(userId, isDeleted);
  }

  @ApiOperation({ summary: 'Get replies by parent comment ID' })
  @ApiQuery({
    name: 'isDeleted',
    required: false,
    type: Boolean,
    description: 'Filter by deleted status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of replies to comment',
    type: [CommentResponseDto],
  })
  @Get('parent/:parentCommentId')
  findByParentCommentId(@Param('parentCommentId') parentCommentId: string, @Query('isDeleted') isDeleted?: string) {
    return this.commentService.findByParentCommentId(parentCommentId, isDeleted);
  }

  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment found',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @ApiOperation({ summary: 'Update comment' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner',
  })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    return this.commentService.update(id, updateCommentDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete comment (soft delete)' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(id, req.user.userId);
  }
}
