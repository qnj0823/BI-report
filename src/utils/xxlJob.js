// src/utils/xxlJob.js
import axios from 'axios';

const XXL_JOB_URL = 'http://172.16.100.199:8090/xxl-job-admin';

// 登录并保存 Cookie
export async function loginXxlJob() {
  try {
    const response = await axios.post(
      `${XXL_JOB_URL}/login`,
      'userName=admin&password=123456',
      {
        headers: { 'Content-Type': 'x-www-form-urlencoded' },
        withCredentials: true // 关键：保存 Cookie
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('XXL-Job 登录失败:', error);
    return false;
  }
}

// 触发任务
export async function triggerJob(jobId, executorHandler, params = '') {
  try {
    const response = await axios.post(
      `${XXL_JOB_URL}/api/run`,
      {
        id: jobId,
        executorHandler,
        executorParams: params,
        executorBlockStrategy: 'SERIAL_EXECUTION',
        executorTimeout: 0
      },
      {
        withCredentials: true, // 携带 Cookie
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('触发任务失败:', error);
    throw error;
  }
}