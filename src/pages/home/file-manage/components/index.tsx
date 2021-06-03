import { Upload, message, Button, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

import XLSX from 'xlsx';

interface dataType {
  // dataItem type
  key: number;
  [newKey: string]: unknown;
}
interface columnItem {
  title: string;
  dataIndex: string; // 列数据在数据项中对应的路径
}
const FileManageTest = () => {
  const [columns, setColumns] = useState<Array<columnItem>>([]);
  const [data, setData] = useState<Array<dataType>>([]);

  // 将json对象进行处理转化为表格中需要的数据,就是产生columns和data
  const handleImportedJson = (array: Array<unknown[]>) => {
    const header: Array<unknown> = array[0]; // 表头，用于产生columns 【姓名，年龄】
    const newColumns = formatColumns(header);
    const columnTag: string[] = columnsTagArray(newColumns);
    setColumns(newColumns);
    const newArray = [...array];
    newArray.splice(0, 1); // 去除表头
    const dataSource: Array<dataType> = [];
    newArray.forEach((item: unknown[], index) => {
      let itemJson: dataType = { key: index };
      item.forEach((element: unknown, i: number) => {
        let newKey = columnTag[i];
        itemJson[newKey] = element;
      });
      dataSource.push(itemJson);
    });
    console.log('生成的table数据json:', dataSource);
    setData(dataSource);
  };
  /**
   * 获取需要产生的columns
   * @param header excel表头
   * @returns columns:{title: string; dataIndex: string; key: string;}[]
   */
  const formatColumns = (header: Array<unknown>) => {
    // FIXME： 如何根据title中文值自动生成后面的dataIndex。现在是通过自己手动添加，不是自动设置的。
    const columns = [
      { title: header[0] as string, dataIndex: 'name' },
      { title: header[1] as string, dataIndex: 'age' },
    ];
    return columns;
  };

  /**
   * 获取column的key用于生成对应DataSource的各个属性
   * @param columns
   * @returns columnsTagArray: string[]
   */
  const columnsTagArray = (columns: Array<columnItem>) => {
    let columnsTagArray: string[] = [];
    for (let i = 0; i < columns.length; i++) {
      columnsTagArray.push(columns[i].dataIndex);
    }
    return columnsTagArray;
  };

  const uploadProps = {
    accept: '.xls,.xlsx,application/vnd.ms-excel',
    beforeUpload: (file: File) => {
      const f = file;
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        const datas = event.target?.result; // datas为要上传的文件中的数据
        const workbook = XLSX.read(datas, { type: 'binary' }); // 二进制解析
        const workSheet = workbook.Sheets[workbook.SheetNames[1]]; // 返回工作表对象，参数是工作表名字
        const jsonArr: unknown[][] = XLSX.utils.sheet_to_json(workSheet, {
          header: 1,
        }); // 将worksheet转化成json对象数组
        handleImportedJson(jsonArr);
      };
      fileReader.readAsBinaryString(f);
      return false;
    },
  };

  // excel导出
  const handleExportExcel = () => {};
  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Excel导入</Button>
      </Upload>
      <Button type="primary" onClick={handleExportExcel}>
        excel导出
      </Button>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default FileManageTest;
