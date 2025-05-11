<script setup>
import { ref, onMounted } from 'vue'
import { getStarListService, removeStarService } from '@/api/star.js'
import { ElMessage } from 'element-plus'
import  useUserInfoStore  from '@/stores/userInfo'
import dayjs from 'dayjs'
const userInfoStore = useUserInfoStore()

const starList = ref([])
const total = ref(0)
const pageParams = ref({
  pageNum: 1,
  pageSize: 10
})

// 获取用户信息


// 时间格式化方法
const formatTime = (timeStr) => {
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm')
}

// 加载收藏数据
const loadStarList = async () => {
  try {
    const res = await getStarListService({
      ...pageParams.value,
      userId: userInfoStore.info.id
    })
    starList.value = res.data.items
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('加载收藏列表失败')
  }
}

// 取消收藏操作
const handleUnstar = async (id) => {
  try {
    await removeStarService(id)
    ElMessage.success('取消收藏成功')
    loadStarList() // 刷新列表
  } catch (e) {
    ElMessage.error('操作失败')
  }
}

// 分页处理
const handlePageChange = (newPage) => {
  pageParams.value.pageNum = newPage
  loadStarList()
}

// 初始化加载
onMounted(() => {
  loadStarList()
})
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>我的收藏</span>
            </div>
        </template>
        <!-- 文章列表 -->
        <el-table :data="starList" style="width: 100%">
            <el-table-column label="文章标题" width="300" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName" width="120"></el-table-column>
            <el-table-column label="收藏时间" prop="createTime" width="180">
               <template #default="{row}">
                  {{formatTime(row.createTime) }}
               </template>    
            </el-table-column>
            <el-table-column label="发布时间" prop="articleCreateTime"></el-table-column>
            <el-table-column label="操作" width="200">
                <template #default="{ row }">
                    <el-button
            type="danger"
            size="small"
            @click="handleUnstar(row.articleId)"
            >取消收藏</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination 
          :current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          :total="total"
          @current-change="handlePageChange"
        />
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .search{
        width: 300px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>