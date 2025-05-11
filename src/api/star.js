import request from '@/utils/request.js'
export const getStarListService = (params)=>{
    return request.get('/star/list',{params})
}
export const addStarService = (data) => {
    return request({
      method: 'POST',
      url: '/star/add',
      headers: {
        'Content-Type': 'application/json' // 明确指定 JSON 类型
      },
      data: JSON.stringify(data) // 确保数据被序列化为 JSON
    });
  };
 export const removeStarService = (id)=>{
    return request.delete('/star/remove?id='+id)
}