import React, { useState, useRef, useEffect } from "react";
import { history, useModel } from "umi";
import { Modal, Input } from "antd";
import {
  SearchOutlined,
  CloseOutlined,
  EnterOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import mittBus from "@/utils/mittBus";
import { menuRoutes as menuList } from "@/routes/menuRoutes";
import classnames from "classnames";
import "./style.scss";
export default function Index() {
  const language = "zh";
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchVal, setSearchVal] = useState(""); //搜索值
  const [searchResult, setSearchResult] = useState<API.MenuRoutesType[]>([]); //搜索结果展示
  const historyMaxLength = 5; // 历史记录最大长度
  const { historyResult, setHistoryResult } = useModel("globalSearch"); //记录历史搜索记录
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState([0, 0]); // [parentIndex, childIndex]
  const [historyHIndex, setHistoryHIndex] = useState(0);

  useEffect(() => {
    mittBus.addListener("openSearchDialog", openSearchDialog);

    // document.addEventListener("keydown", handleKeydown);
    return () => {
      //   document.removeEventListener("keydown", handleKeydown);
    };
  }, []);
  const handleKeydown = (event: KeyboardEvent) => {
    debugger;
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    // const isCommandKey = isMac ? event.metaKey : event.ctrlKey;

    if (event.key.toLowerCase() === "d") {
      event.preventDefault();
      setShowSearchDialog(false);
    }
  };

  const focusInput = () => {
    setTimeout(() => {
      searchInput.current?.focus();
    }, 100);
  };

  // 模糊查询
  const fuzzyQueryList = (
    arr: API.MenuRoutesType[],
    val: string
  ): API.MenuRoutesType[] => {
    const titleField = language === "zh" ? "title" : "title_en";
    const lowerVal = val; // 将查询值转换为小写
    const searchItem = (
      item: API.MenuRoutesType
    ): API.MenuRoutesType | null => {
      // 如果当前项有 isHide: true，直接过滤掉
      if (item.hidden) return null;

      // 将 item[titleField] 转换为小写进行比较
      const lowerItemTitle = item[titleField];

      // 查找子项并过滤符合条件的子项
      const routes = item.routes ? fuzzyQueryList(item.routes, val) : [];
      // 如果子项符合条件或当前项标题包含查询值，返回该项
      if (routes.length > 0) {
        return { ...item, routes };
      } else if (lowerItemTitle && lowerItemTitle.includes(lowerVal)) {
        return { routes: [item], ...item };
      }
      // 否则过滤掉
      return null;
    };

    // 使用 map 和 filter 来优化处理逻辑，排除 null 结果
    const result = arr
      .map(searchItem)
      .filter((item: API.MenuRoutesType | null) => item !== null);
    return result;
  };

  // 搜索逻辑
  const search = (val: string) => {
    if (val) {
      let list = fuzzyQueryList(menuList, val);
      //   const result =
      //     list.filter((item) => {
      //       return item.routes!.length;
      //     }) || [];
      setSearchResult(list);
    } else {
      setSearchResult([]);
    }
    setSearchVal(val);
  };

  // 搜索框键盘向上切换
  const highlightPrevious = () => {
    if (searchVal) {
      const [parentIndex, childIndex] = highlightedIndex;
      if (childIndex > 0) {
        setHighlightedIndex([parentIndex, childIndex - 1]);
      } else if (parentIndex > 0) {
        const previousParent = searchResult[parentIndex - 1];
        const newChildIndex =
          previousParent?.routes && previousParent.routes.length > 0
            ? previousParent.routes.length - 1
            : -1;
        setHighlightedIndex([parentIndex - 1, newChildIndex]);
      } else {
        const lastParentIndex = searchResult.length - 1;
        const lastParent = searchResult[lastParentIndex];
        const newChildIndexY =
          lastParent?.routes && lastParent.routes.length > 0
            ? lastParent.routes.length - 1
            : -1;
        setHighlightedIndex([lastParentIndex, newChildIndexY]);
      }
    } else {
      setHistoryHIndex(
        (historyHIndex - 1 + historyResult.length) % historyResult.length
      );
    }
  };

  // 搜索框键盘向下切换
  const highlightNext = () => {
    if (searchVal) {
      const [parentIndex, childIndex] = highlightedIndex;
      const currentParent = searchResult[parentIndex];
      const hasMoreChildren =
        currentParent?.routes && childIndex < currentParent.routes?.length - 1;
      if (hasMoreChildren) {
        setHighlightedIndex([parentIndex, childIndex + 1]);
      } else if (parentIndex < searchResult.length - 1) {
        setHighlightedIndex([parentIndex + 1, 0]);
      } else {
        setHighlightedIndex([0, 0]);
      }
    } else {
      setHistoryHIndex((historyHIndex + 1) % historyResult.length);
    }
  };

  // 搜索框键盘回车跳转页面
  const selectHighlighted = () => {
    if (searchVal) {
      const [parentIndex, childIndex] = highlightedIndex;
      if (
        parentIndex !== -1 &&
        searchResult &&
        searchResult?.length > 0 &&
        searchResult[parentIndex] &&
        searchResult[parentIndex]?.routes &&
        searchResult[parentIndex]!.routes!.length &&
        searchResult[parentIndex]!.routes!.length > childIndex // 确保 childIndex 不越界
      ) {
        const selectedItem =
          childIndex === -1
            ? searchResult[parentIndex]
            : searchResult[parentIndex]!.routes![childIndex];
        if (selectedItem) {
          searchInput.current?.blur();
          searchGoPage(selectedItem);
        }
      }
    } else {
      if (!searchVal && historyResult.length === 0) {
        return;
      }
      searchGoPage(historyResult[historyHIndex]);
    }
  };

  // 判断当前是否高亮菜单
  const isHighlighted = (parentIndex: number, childIndex?: number) => {
    const [highlightedParentIndex, highlightedChildIndex] = highlightedIndex;
    return childIndex === undefined
      ? highlightedParentIndex === parentIndex && highlightedChildIndex === -1
      : highlightedParentIndex === parentIndex &&
          highlightedChildIndex === childIndex;
  };

  // 输入框失焦时默认高亮第一个菜单
  const searchBlur = () => {
    setHighlightedIndex([0, 0]);
  };

  // 根据搜索结果去到相应界面
  const searchGoPage = (item: API.MenuRoutesType) => {
    setShowSearchDialog(false);
    addHistory(item);

    // let { link, isIframe } = item.meta;
    // if (link) {
    //   openLink(link, isIframe);
    //   return;
    // }
    history.push(item.path);
    setSearchVal("");
    setSearchResult([]);
  };

  // 添加历史记录
  const addHistory = (item: API.MenuRoutesType) => {
    const hasItemIndex = historyResult.findIndex(
      (historyItem: API.MenuRoutesType) => historyItem.path === item.path
    );
    const result = [...historyResult];
    if (hasItemIndex !== -1) {
      result.splice(hasItemIndex, 1); // 如果存在则删除
    } else if (historyResult.length >= historyMaxLength) {
      result.pop(); // 超过最大记录数则删除最后一个
    }

    // cleanItem(item);
    result.unshift(item); // 添加新的 item 到头部
    setHistoryResult(result);
  };

  //   const cleanItem = (item: API.MenuRoutesType) => {
  //     delete item.children;
  //     delete item.meta.authList;
  //   };

  const deleteHistory = (index: number) => {
    const arr = [...historyResult];
    arr.splice(index, 1);
    setHistoryResult(arr);
  };

  const openSearchDialog = () => {
    setShowSearchDialog(true);
    focusInput();
  };

  const closeSearchDialog = () => {
    setSearchVal("");
    setSearchResult([]);
    setHighlightedIndex([0, 0]);
    setHistoryHIndex(0);
    setShowSearchDialog(false);
  };

  // 鼠标 hover 高亮
  const highlightOnHover = (pIndex: number, cIndex: number) => {
    setHighlightedIndex([pIndex, cIndex]);
  };
  return (
    <Modal
      title={null}
      closable={false}
      width="40%"
      wrapClassName="search-modal"
      className="search-dialog"
      open={showSearchDialog}
      onCancel={closeSearchDialog}
      keyboard={true}
      maskClosable={true}
      footer={
        <div className="dialog-footer">
          <div>
            <i className="iconfont-sys">
              <UpOutlined />
            </i>
            <i className="iconfont-sys">
              <DownOutlined />
            </i>
            <div className="tips">切换</div>
          </div>
          <div>
            <i className="iconfont-sys">
              <EnterOutlined />
            </i>
            <div className="tips">选择</div>
          </div>
        </div>
      }
      bodyStyle={{ padding: "25px 6px" }}
    >
      <Input
        className="input-searchRoute"
        prefix={<SearchOutlined />}
        placeholder="搜索页面"
        value={searchVal}
        // onChange={(e) => setSearchVal(e.target.value)}
        onInput={(e) => search(e.target.value)}
        onBlur={searchBlur}
        // onPressEnter={(e) => search(e.target.value)}
        suffix="ESC"
        ref={searchInput}
        onKeyDown={(event) => {
          event.stopPropagation();
          if (event.code === "ArrowDown") {
            highlightNext();
          } else if (event.code === "ArrowUp") {
            highlightPrevious();
          } else if (event.code === "Enter") {
            selectHighlighted();
          }
        }}
      />
      {searchResult.length > 0 && (
        <div className="result">
          {searchResult?.map((item, pIndex) => {
            return (
              <div className="box" key={pIndex}>
                {item.routes &&
                  item.routes!.length > 0 &&
                  item.routes?.map((cItem, cIndex) => (
                    <div
                      key={cIndex}
                      onClick={() => searchGoPage(cItem)}
                      onMouseEnter={() => highlightOnHover(pIndex, cIndex)}
                      className={classnames({
                        highlighted: isHighlighted(pIndex, cIndex),
                      })}
                    >
                      {cItem.title}
                      {isHighlighted(pIndex, cIndex) && (
                        <i className="selected-icon iconfont-sys">
                          <EnterOutlined />
                        </i>
                      )}
                    </div>
                  ))}
              </div>
            );
          })}
        </div>
      )}
      {!searchVal && searchResult.length === 0 && historyResult.length > 0 && (
        <div className="history-box">
          <p className="title">搜索历史</p>
          <div className="history-result">
            {historyResult?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={classnames("box", {
                    highlighted: historyHIndex === index,
                  })}
                  onClick={() => searchGoPage(item)}
                  onMouseEnter={() => setHistoryHIndex(index)}
                >
                  {item.title}
                  <i
                    className="selected-icon iconfont-sys"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistory(index);
                    }}
                  >
                    <CloseOutlined />
                  </i>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
