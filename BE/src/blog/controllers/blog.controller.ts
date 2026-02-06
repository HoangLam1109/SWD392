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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { UpdateBlogStatusDto } from '../dto/update-status-blog.dto';
import { BlogResponseDto } from '../dto/blog-response.dto';
import { PaginationOptionsDto } from '../../common/dto/pagination-option.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BlogStatus } from '../enum/blog.enum';
import { CloudinaryInterceptor } from '../../common/interceptors/cloudinary.interceptor';

@ApiBearerAuth()
@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 201,
    description: 'Blog created successfully',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'content'],
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        thumbnail: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', CloudinaryInterceptor('blogs')),
  )
  @Post()
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Multer.File,
    @Request() req,
  ) {
    if (file?.path) {
      createBlogDto.thumbnailUrl = file.path;
    }
    return this.blogService.create(createBlogDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Get all blogs with pagination' })
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
    name: 'status',
    required: false,
    enum: BlogStatus,
    description: 'Filter by blog status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all blogs with pagination',
    type: PaginationResponseDto,
  })
  @Get()
  findAll(@Query() query: PaginationOptionsDto) {
    return this.blogService.findAllWithPagination(query);
  }

  @ApiOperation({ summary: 'Get blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'Blog found',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  @ApiOperation({ summary: 'Get blogs by user ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: BlogStatus,
    description: 'Filter by blog status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of blogs by user',
    type: [BlogResponseDto],
  })
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string, @Query('status') status?: BlogStatus) {
    return this.blogService.findByUserId(userId, status);
  }

  @ApiOperation({ summary: 'Update blog' })
  @ApiResponse({
    status: 200,
    description: 'Blog updated successfully',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        thumbnail: { type: 'string', format: 'binary' },
        removeThumbnail: { type: 'boolean', default: false },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnail', CloudinaryInterceptor('blogs')),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Multer.File,
    @Request() req,
  ) {
    if (file?.path) {
      updateBlogDto.thumbnailUrl = file.path;
    }
    return this.blogService.update(id, updateBlogDto, req.user.userId);
  }

  @ApiOperation({ summary: 'Delete blog' })
  @ApiResponse({
    status: 200,
    description: 'Blog deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.blogService.remove(id, req.user.userId);
  }

  @ApiOperation({ summary: 'Update blog status' })
  @ApiResponse({
    status: 200,
    description: 'Blog status updated successfully',
    type: BlogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Blog not found',
  })
  @UseGuards(AuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBlogStatusDto,
  ) {
    return this.blogService.updateStatus(id, updateStatusDto.status);
  }
}
