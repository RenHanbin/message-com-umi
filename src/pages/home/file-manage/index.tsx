import { Upload, message, Button, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import FileManageTest from './components/index';

const FileManage = () => {
  const props = {
    // FIXME: 后期根据上传的文件名自动获取文件名
    name: 'file', // 发送到后台的文件参数名
    action: (file: File) => {}, // 上传的地址
    headers: {},
  };

  const handleChange = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file upload succeed!`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload error!`);
    }
  };

  const onFinish = (value: any) => {
    console.log('form get upload value:', value.upload);
  };
  const normFile = (e: any) => {
    // 把事件的值转换成字段值
    console.log('upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <>
      {/* <Form onFinish={onFinish}>
        <Form.Item name="upload" label="Upload" getValueFromEvent={normFile}>
          <Upload onChange={handleChange}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form> */}
      <FileManageTest />
    </>
  );
};

export default FileManage;
