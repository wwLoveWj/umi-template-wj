import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import CommentItem from "./CommentItem";
import "./comment.less";

const { TextArea } = Input;
export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}
export const commentList1: Comment[] = [
  {
    id: 1,
    author: "白夜",
    content: "黑神话悟空的打斗场面真的燃爆了！期待上线！",
    timestamp: "2024-09-04 09:00",
    replies: [
      {
        id: 101,
        author: "星河",
        content: "是啊，特别是那些技能特效，简直帅炸！",
        timestamp: "2024-09-04 09:15",
        replies: [
          {
            id: 201,
            author: "光芒",
            content: "希望优化能跟上，不然这么好的画面如果卡顿就可惜了。",
            timestamp: "2024-09-04 09:30",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    author: "浮生",
    content: "据说黑神话悟空需要很高的配置，不知道我的电脑能不能跑起来。",
    timestamp: "2024-09-04 10:00",
    replies: [
      {
        id: 102,
        author: "晨曦",
        content: "同担心啊，听说需要至少RTX 3070才能高效运行。",
        timestamp: "2024-09-04 10:20",
        replies: [
          {
            id: 202,
            author: "流光",
            content: "我是打算升级配置，等这款游戏就是了。",
            timestamp: "2024-09-04 10:40",
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    author: "风铃",
    content: "130GB的存储要求有点夸张啊，不过画质这么好，也情有可原。",
    timestamp: "2024-09-04 11:00",
    replies: [
      {
        id: 103,
        author: "云端",
        content: "确实有点高，不过为了这种品质的游戏，值得。",
        timestamp: "2024-09-04 11:15",
        replies: [
          {
            id: 203,
            author: "梦境",
            content: "希望发售后能优化一下安装包体积。",
            timestamp: "2024-09-04 11:30",
            replies: [],
          },
        ],
      },
    ],
  },
];

export default function CommentWidget() {
  const [form] = Form.useForm();
  const [commentList, setCommentList] = useState(commentList1);
  const [showReplyForm, setShowReplyForm] = useState<number | null>(null);
  const onFinish = (values: any) => {
    console.log("Success:", values);
    const arr = [...commentList];
    arr.push({
      id: Date.now(),
      author: values.author,
      content: values.content,
      timestamp: new Date().toISOString(),
      replies: [],
    });
    setCommentList(arr);
    form.resetFields();
  };
  const findComment = (
    comments: Comment[],
    commentId: number
  ): Comment | undefined => {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      const found = findComment(comment.replies, commentId);
      if (found) {
        return found;
      }
    }
    return undefined;
  };
  const addReply = (values: {
    commentId: number;
    replyAuthor: string;
    replyContent: string;
  }) => {
    const comment = findComment(commentList, values?.commentId);
    debugger;
    if (comment) {
      comment.replies.push({
        id: Date.now(),
        author: values?.replyAuthor,
        content: values?.replyContent,
        timestamp: new Date().toISOString(),
        replies: [],
      });
      setShowReplyForm(null);
    } else {
      alert("请填写完整的回复信息");
    }
  };

  const toggleReply = (commentId: number) => {
    setShowReplyForm(showReplyForm === commentId ? null : commentId);
  };
  return (
    <div className="comment-module">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label=""
          name="author"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="你的名称" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label=""
          name="content"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <TextArea rows={4} placeholder="简单说两句..." maxLength={6} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
          <Button type="primary" htmlType="submit" className="btn">
            发布
          </Button>
        </Form.Item>
      </Form>

      <ul>
        <div className="comment-header">评论 {commentList.length}</div>
        {commentList
          .slice()
          .reverse()
          ?.map((comment) => (
            <div className="comment-item-outside" key={comment.id}>
              <CommentItem
                comment={comment}
                showReplyForm={showReplyForm}
                toggleReply={toggleReply}
                addReply={addReply}
              />
            </div>
          ))}
      </ul>
    </div>
  );
}
