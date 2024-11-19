import React from "react";
import { Form, Input, Button } from "antd";
import { randomColor } from "@/utils/color";
import { formatDate } from "@/utils/time";
import "./commentItem.less";

const { TextArea } = Input;
export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}
export default function CommentItem({
  comment,
  showReplyForm,
  toggleReply,
  addReply,
}: {
  comment: Comment;
  showReplyForm: number | null;
  toggleReply: (commentId: number) => void;
  addReply: (values: {
    commentId: number;
    author: string;
    content: string;
  }) => void;
}) {
  const [form] = Form.useForm();
  const onFinish = (values: {
    commentId: number;
    author: string;
    content: string;
  }) => {
    console.log("Success:", values);
    // commentList.push({
    //   id: Date.now(),
    //   author: values.author,
    //   content: values.content,
    //   timestamp: new Date().toISOString(),
    //   replies: [],
    // });
    addReply({ ...values, commentId: comment.id });
    form.resetFields();
  };
  return (
    <li className="comment-item">
      <div className="comment-main">
        <div className="comment-header">
          <div className="avatar" style={{ background: randomColor() }}>
            {comment.author.substring(0, 1)}
          </div>
          <strong className="name dark-text">{comment.author}</strong>
        </div>
        <span className="content">{comment.content}</span>
        <div className="comment-info">
          <span className="date">{formatDate(comment.timestamp)}</span>
          <div className="btn-text" onClick={() => toggleReply(comment.id)}>
            回复
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <ul className="comment-replies">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              showReplyForm={showReplyForm}
              toggleReply={toggleReply}
              addReply={addReply}
            />
          ))}
        </ul>
      )}
      {showReplyForm === comment.id && (
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
            name="replyAuthor"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="你的名称" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label=""
            name="replyContent"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <TextArea rows={4} placeholder="你的回复" maxLength={6} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
            <Button type="primary" htmlType="submit" className="btn">
              发布
            </Button>
          </Form.Item>
        </Form>
      )}
    </li>
  );
}
