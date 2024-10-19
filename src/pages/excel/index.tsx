import React, { useRef } from "react";
import { Button, Space } from "antd";
import WjTable, { WjTableColumns, WjTableRefType } from "@/components/WjTable";
import { history } from "umi";
import DelPopconfirm from "@/components/DelPopconfirm";
import dayjs from "dayjs";
import {
  ExcelInfoExportAPI,
  ExcelInfoImportAPI,
  ExcelInfoQueryAPI,
  ExcelInfoDelAPI,
} from "@/service/api/excel";
import { useRequest } from "ahooks";

interface FileInputEvent extends React.FormEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList;
  };
}
export default function Index() {
  const actionRef = useRef<WjTableRefType>(null);
  const ExcelInfoDelAPIRun = useRequest(ExcelInfoDelAPI, {
    manual: true,
    onSuccess: () => {
      // 查询列表信息;
      actionRef?.current?.reload();
    },
  });
  // 列表项配置
  const columns: WjTableColumns = [
    {
      title: "待办事项",
      dataIndex: "backlogName",
      search: true,
      valueType: "input",
      width: 180,
    },
    {
      valueType: "select",
      dataIndex: "status",
      search: true,
      title: "是否通知",
      fieldProps: {
        placeholder: "请选择通知状态",
        options: [
          {
            label: "已通知",
            value: "1",
          },
          {
            label: "未通知",
            value: "2",
          },
        ],
      },
    },
    {
      valueType: "select",
      search: true,
      // colProps: { span: 12 },
      dataIndex: "sourceBuy",
      title: "购买渠道",
      fieldProps: {
        placeholder: "请选择购买渠道",
        options: [
          {
            label: "拼多多",
            value: "0",
          },
          {
            label: "淘宝",
            value: "1",
          },
          {
            label: "京东",
            value: "2",
          },
        ],
      },
    },
    {
      title: "备注",
      dataIndex: "description",
      render: (_, { editorContent }) => {
        return <p dangerouslySetInnerHTML={{ __html: editorContent }}></p>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 210,
      render: (_, { createTime }) => {
        return createTime
          ? dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
          : "-";
      },
    },
    {
      title: "操作",
      key: "action",
      sorter: true,
      width: 120,
      render: (record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              history.push(
                { pathname: "/excel/edit" },
                { backlogId: record?.backlogId }
              );
            }}
          >
            编辑
          </a>
          <DelPopconfirm
            onConfirm={() => {
              ExcelInfoDelAPIRun.run({ backlogId: record?.backlogId });
            }}
            title={`确定要删除【${record?.backlogName}】的文章信息吗?`}
          />
          {/* <a
            onClick={() => {
              history.push(
                {
                  pathname: "/user-integral/integral-details",
                },
                { ...record }
              );
            }}
          >
            详情
          </a> */}
        </Space>
      ),
    },
  ];

  // 原文链接：https://blog.csdn.net/snows_l/article/details/139998373
  /**
   * 导出excel接口
   */
  const ExcelInfoExportAPIRun = useRequest(ExcelInfoExportAPI, {
    debounceWait: 100,
    manual: true,
    onSuccess: (res) => {
      let source = res?.data;
      // 创建 Blob 对象
      // const blob = new Blob([res?.data], { type: "application/octet-stream" });
      const blob = new Blob([new Uint8Array(source)]);
      // 创建一个隐藏的 <a> 标签
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = dayjs()?.format("YYYY-MM-DD HH:mm:ss") + "待办事项.xlsx"; // 设置下载文件名
      // 将链接添加到 DOM 中
      document.body.appendChild(link);
      // 触发点击事件
      link.click();
      // 移除链接
      document.body.removeChild(link);
    },
  });

  /**
   *
   * @param file 文件
   * @param append 是追加还是覆盖文件 ----- 1：追加，2：覆盖
   * @param name
   */
  async function importExcel(append = 1, name = "") {
    // 创建虚拟的input标签
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    // input.setAttribute("multiple", "multiple");
    // input.setAttribute("accept", "xlsx/*");
    input.click();
    input.onchange = function (event: any) {
      // 判断是否是图片格式文件
      const file = event.target.files[0];
      let formData = new FormData();
      let suffix = file.name && file.name.split(".")[1]; //文件类型后缀xlsx
      let defaultName = file.name && file.name.split(".")[0]; //默认文件名
      let fileName = name
        ? name.replace(/[\u4e00-\u9fa5]/g, "") + "." + suffix
        : defaultName.replace(/[\u4e00-\u9fa5]/g, "") + "." + suffix;
      formData.append("file", file, fileName);
      // if (!isImage(file)) {
      //   return;
      // }
      // TODO:判断文件大小
      // 上传文件的接口
      ExcelInfoImportAPI(formData, append);
    };
    input.remove();
  }
  // 选择要上传的文件
  // const handleFileChange = (e: FileInputEvent) => {
  //   //获取文件
  //   let fileData = e.target.files[0];
  //   //转化为arrayBufferr
  //   // file.arrayBuffer().then((res) => {
  //   //   //读取book对象
  //   //   let wb = read(res);
  //   //   let sheet = wb.Sheets["2024年4月"];
  //   //   console.log(sheet, "sheet-----------");
  //   //   console.log(wb);
  //   // });
  //   // 读取 Excel 文件
  //   // let file = new Blob([fileData]);
  // };
  return (
    <div>
      excel文件导入导出
      {/* <input type="file" name="file" onChange={handleFileChange} /> */}
      <WjTable
        // actionRef={actionRef}
        columns={columns}
        request={{ url: ExcelInfoQueryAPI, params: {} }}
        rowKey="editorId"
        size="small"
        noCard={true}
        createBtnOperations={[
          <Button type="primary" onClick={() => importExcel(1)}>
            导入excel
          </Button>,
          <Button onClick={() => ExcelInfoExportAPIRun.run()}>
            下载excel
          </Button>,
          <Button>批量导出</Button>,
        ]}
        // sticky
        // scroll={{ y: "max-content" }}
        // batchOpertions={[{ label: "批量上传" }]}
      />
    </div>
  );
}
