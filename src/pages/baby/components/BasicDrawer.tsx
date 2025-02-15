import React, { useMemo } from "react";
import { Form } from "antd";
import { FeedingInfoCreateAPI, FeedingInfoUpdateAPI } from "@/service/api/baby";
import { useRequest } from "ahooks";
import { WjDrawer } from "magical-antd-ui";
import { WjForm } from "@/components/WjForm";
import vstores from "vstores";
import { guid } from "@/utils";
import dayjs from "dayjs";

const feedingTimeOptions = [
  {
    label: "3:00",
    value: "3:00",
  },
  {
    label: "6:00",
    value: "6:00",
  },
  {
    label: "9:00",
    value: "9:00",
  },
  {
    label: "12:00",
    value: "12:00",
  },
  {
    label: "15:00",
    value: "15:00",
  },
  {
    label: "18:00",
    value: "18:00",
  },
  {
    label: "21:00",
    value: "21:00",
  },
  {
    label: "24:00",
    value: "24:00",
  },
];
const MyModal = WjDrawer.create(({ feedingId }: { feedingId: string }) => {
  const modal = WjDrawer.useDrawer();
  const [formRef] = Form.useForm();
  const isEditMode = !!feedingId;
  const allRecordedTimeList = vstores.get(dayjs().format("YYYY-MM-DD")) || [];
  // 创建定时任务队列
  const reminderTimeTaskFn = useRequest(FeedingInfoCreateAPI, {
    manual: true,
    onSuccess: (res) => {
      // modal.resolve();
      // debugger;
      // TODO: 查询列表更新信息
      // 语音提示用户任务
      // const utterThis = new window.SpeechSynthesisUtterance(taskDetails.task);
      // window.speechSynthesis.speak(utterThis);
    },
  });
  // 禁用已经录入的时间段
  const feedingTimeOptionsDisabled = useMemo(() => {
    const result = feedingTimeOptions.filter(
      (item: { disabled: boolean; value: string; label: string }) => {
        item.disabled = allRecordedTimeList?.includes(item?.value);
        return item;
      }
    );
    return result;
  }, [allRecordedTimeList]);

  const columns: any[] = [
    {
      valueType: "select",
      search: true,
      dataIndex: "eventType",
      title: "事件类型",
      formItemProps: {
        rules: [{ required: true }],
        initialValue: 2,
      },
      fieldProps: {
        options: [
          {
            label: "换尿布",
            value: 1,
          },
          {
            label: "吃奶",
            value: 2,
          },
        ],
        placeholder: "请选择事件",
      },
    },
    // {
    //   valueType: "time",
    //   search: true,
    //   dataIndex: "feedingTime",
    //   title: "吃奶时间",
    //   formItemProps: {
    //     rules: [{ required: true }],
    //   },
    //   fieldProps: {
    //     defaultValue: dayjs("12:00", "HH:mm"),
    //     format: "HH:mm",
    //     placeholder: "请选择吃奶时间",
    //   },
    // },
    {
      valueType: "select",
      search: true,
      dataIndex: "feedingTime",
      title: "吃奶时间",
      formItemProps: {
        rules: [{ required: true }],
        initialValue: vstores.get("feedingTime"),
        getValueFromEvent: (e: string) => {
          return e;
        },
      },
      fieldProps: {
        options: feedingTimeOptionsDisabled,
        placeholder: "请选择吃奶时间",
      },
    },
    {
      valueType: "slider",
      dataIndex: "milkYield",
      title: "奶量",
      search: true,
      formItemProps: {
        rules: [{ required: true }],
        initialValue: 70,
      },
      fieldProps: {
        defaultValue: 30,
        min: 30,
        max: 150,
        placeholder: "请选择当次奶量",
      },
    },
    // {
    //   valueType: "radio",
    //   dataIndex: "feedingStatus",
    //   search: true,
    //   title: "吃奶情况",
    //   formItemProps: {
    //     rules: [{ required: true }],
    //     initialValue: 1,
    //   },
    //   fieldProps: {
    //     options: [
    //       {
    //         label: "未达标",
    //         value: 0,
    //       },
    //       {
    //         label: "已达标",
    //         value: 1,
    //       },
    //     ],
    //     placeholder: "请选择吃奶情况",
    //   },
    // },
    {
      valueType: "rate",
      dataIndex: "feedingStatus",
      search: true,
      title: "吃奶情况",
      formItemProps: {
        rules: [{ required: true }],
        initialValue: 2,
      },
      fieldProps: {
        allowHalf: true,
        defaultValue: 2.5,
        placeholder: "请选择吃奶情况",
      },
    },
    {
      valueType: "textarea",
      search: true,
      dataIndex: "description",
      title: "备注",
    },
  ];

  const actTime = (time: string) => {
    const actNum = time.split(":")[0];
    if (allRecordedTimeList?.includes(time)) {
      actTime(Number(actNum) + 3 + ":00");
    } else {
      vstores.set("feedingTime", time === "27:00" ? "3:00" : time);
    }
  };
  return (
    <WjDrawer
      {...modal.props}
      title={"吃奶记录"}
      onOk={() => {
        return formRef?.validateFields().then(async (res) => {
          // const time = dayjs(res?.feedingTime).format("HH:mm");
          const params = isEditMode
            ? { ...res, feedingId }
            : { ...res, feedingId: guid() };
          let arr = allRecordedTimeList;
          arr.push(res?.feedingTime);
          vstores.set(dayjs().format("YYYY-MM-DD"), [...new Set(arr)]);

          // 这里是为了自动录下一个时间点

          actTime(res?.feedingTime);

          await reminderTimeTaskFn.runAsync(params);
          modal.resolve();
        });
      }}
    >
      <WjForm
        form={formRef}
        formType="basic"
        noCard={true}
        formConfigList={columns?.filter((item) => item?.search)}
      />
    </WjDrawer>
  );
});

export default MyModal;
