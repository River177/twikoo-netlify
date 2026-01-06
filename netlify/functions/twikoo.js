const twikooHandler = require('twikoo-netlify').handler

// CORS 配置 - 使用标准 HTTP 头格式
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://river177.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
}

// 添加 CORS 头到响应的辅助函数
function addCorsHeaders(response) {
  if (!response || typeof response !== 'object') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    }
  }

  const responseHeaders = response.headers || {}
  
  // 确保 body 是字符串格式
  let body = response.body
  if (body !== undefined && typeof body !== 'string') {
    body = JSON.stringify(body)
  } else if (body === undefined) {
    body = ''
  }
  
  return {
    statusCode: response.statusCode || 200,
    headers: {
      ...corsHeaders,
      ...responseHeaders,
    },
    body: body,
  }
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

  try {
    // 调用原始的 twikoo handler
    const response = await twikooHandler(event, context)
    
    // 调试日志
    console.log('Twikoo response:', JSON.stringify({
      statusCode: response?.statusCode,
      hasHeaders: !!response?.headers,
      headersKeys: response?.headers ? Object.keys(response.headers) : [],
    }))
    
    // 添加 CORS 头并返回
    const finalResponse = addCorsHeaders(response)
    console.log('Final response headers:', Object.keys(finalResponse.headers))
    
    return finalResponse
  } catch (error) {
    // 错误处理时也要包含 CORS 头
    console.error('Twikoo handler error:', error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
    }
  }
}
