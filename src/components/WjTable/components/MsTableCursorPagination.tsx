import { HomeOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Select, Space } from "antd";
import { get, isNil } from "lodash-es";
import type { MsTableCursorPaginationProps } from "../type";

// import "./index.less";

function MsTableCursorPagination(props: MsTableCursorPaginationProps) {
  const {
    pageStart,
    pageType,
    pageSize,
    pageSizeOptions = [10, 20, 50, 100],
    onChange,
    dataSource = [],
    pageStartKey = "pageStart",
    hasNext,
    hasPrev,
  } = props;

  const options = pageSizeOptions.map((item) => ({
    label: item + "条/页",
    value: item,
  }));

  const handleChange = (value: number) => {
    onChange?.(undefined, value, pageStart, pageType);
  };

  const handlePrev = () => {
    const start = get(dataSource[0], pageStartKey)?.toString();
    if (isNil(pageSize)) return;
    if (isNil(start)) return;
    onChange?.(undefined, pageSize, start, "prev");
  };

  const handleNext = () => {
    const start = get(
      dataSource[dataSource.length - 1],
      pageStartKey
    )?.toString();
    if (isNil(pageSize)) return;
    if (isNil(start)) return;
    onChange?.(undefined, pageSize, start, "next");
  };

  const handleHome = () => {
    if (isNil(pageSize)) return;
    onChange?.(undefined, pageSize, undefined, pageType);
  };

  return (
    <Space>
      <Button
        className="ms-table-cursor-pagination-button"
        icon={<HomeOutlined />}
        size="small"
        type="text"
        onClick={() => handleHome()}
      >
        回到首页
      </Button>

      <Button
        className="ms-table-cursor-pagination-button"
        style={{ marginLeft: 10 }}
        title="上一页"
        size="small"
        type="text"
        icon={<LeftOutlined />}
        onClick={() => handlePrev()}
        disabled={!hasPrev}
      />

      <Button
        className="ms-table-cursor-pagination-button"
        style={{ marginRight: 10 }}
        title="下一页"
        type="text"
        size="small"
        icon={<RightOutlined />}
        onClick={() => handleNext()}
        disabled={!hasNext}
      />

      <Select
        size="small"
        options={options}
        defaultValue={pageSizeOptions[0] as number}
        value={pageSize}
        onChange={handleChange}
      />
    </Space>
  );
}

export default MsTableCursorPagination;
