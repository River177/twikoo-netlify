const twikooHandler = require('twikoo-netlify').handler

// CORS 配置
const allowedOrigins = ['https://river177.com']
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://river177.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

exports.handler = async (event, context) => {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      },
      body: '',
    }
  }

  // 调用原始的 twikoo handler
  const response = await twikooHandler(event, context)

  // 确保响应格式正确
  const responseHeaders = response.headers || {}
  
  // 添加 CORS 头到响应
  return {
    statusCode: response.statusCode || 200,
    headers: {
      ...responseHeaders,
      ...corsHeaders,
    },
    body: response.body || '',
  }
}
