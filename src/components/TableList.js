import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import './TableList.scss'

const TableList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files && files.map((file) => {
        // 显示未保存的小圆点状态
        const withUnsavedMark = unsaveIds.includes(file.id)
        // 显示关闭按钮
        const fClassName = classNames({
          'nav-link': true,
          'active': file.id === activeId,
          'withUnsaved': withUnsavedMark
        })
        return (
          <li className="nav-item" key={file.id}>
            <a
              href="#"
              className={fClassName}
              onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}
            >
              {file.title}
              <span
                className="ml-2 close-icon"
                // 阻止事件冒泡 `stopPropagation()`
                onClick={(e) => {e.stopPropagation(); onCloseTab(file.id)}}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
              {
                withUnsavedMark && <span className="rounded-circle ml-2 unsaved-icon"></span>
              }
            </a>
          </li>
        )
      })}
    </ul>
  )
}

TableList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func
}
TableList.defaultProps = {
  unsaveIds: []
}

export default TableList