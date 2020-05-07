import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faMarkdown } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'
import useContextMenu from '../hooks/useContextMenu'
import { getParentNode } from '../utils/helper'
const { remote } = window.require('electron')

const { Menu, MenuItem } = remote

const FileList = ({ files, onFileClick, onFileEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false)
  const [value, setValue] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  let node = useRef(null)
  // 拿到键盘的触发事件
  const closeSearch = (editItem) => {
    setEditStatus(false)
    setValue('')
    if (editItem.isNew) {
      onFileDelete(editItem.id)
    }
  }
  const clickItem = useContextMenu([
    {
      label: '打开',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item')
        if (parentElement) {
          onFileClick(parentElement.dataset.id)
        }
      }
    },
    {
      label: '重命名',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item')
        if (parentElement) {
          const { id, title } = parentElement.dataset
          setEditStatus(id)
          setValue(title)
        }
        // console.log('编辑 => ', parentElement.dataset.title);
      }
    },
    {
      label: '删除',
      click: () => {
        const parentElement = getParentNode(clickItem.current, 'file-item')
        if (parentElement) {
          onFileDelete(parentElement.dataset.id)
        }
        console.log('获取元素的id => ', parentElement.dataset.title);
      }
    }
  ], '.file-list', [files])
  useEffect(() => {
    // 引入自定义hook
    const editItem = files.find(file => file.id === editStatus)
    if (enterPressed && editStatus && value.trim() !== '') {
      onFileEdit(editItem.id, value, editItem.isNew)
      setEditStatus(false)
      setValue('')
    }
    if (escPressed && editStatus) {
      closeSearch(editItem)
    }
  })
  useEffect(() => {
    const newFile = files.find(file => file.isNew)
    // console.log(newFile, '=> is FileList')
    if (newFile) {
      setEditStatus(newFile.id)
      setValue(newFile.title)
    }
  }, [files])
  useEffect(() => {
    if (editStatus) {
      node.current.focus()
    }
  }, [editStatus])
  return (
    <ul className="list-group list-group-flush file-list">
      {
        files && files.map(file => {
          return <li className="row list-group-item bg-light d-flex align-items-center file-item mx-0" key={file.id} data-id={file.id} data-title={file.title}>
            {(file.id !== editStatus && !file.isNew) &&
              <>
                <span className="col-2"><FontAwesomeIcon icon={faMarkdown} /></span>
                <span className="col-6 c-link" onClick={() => { onFileClick(file.id) }}>{file.title}</span>
                <button type="button" className="icon-button col-2" onClick={() => { setEditStatus(file.id); setValue(file.title) }}>
                  <FontAwesomeIcon title="编辑" icon={faEdit} />
                </button>
                <button type="button" className="icon-button col-2" onClick={() => { onFileDelete(file.id) }}>
                  <FontAwesomeIcon title="删除" icon={faTrash} />
                </button>
              </>
            }
            {
              ((file.id === editStatus) || file.isNew) &&
              <>
                <input className="form-control col-10" placeholder="请输入文件名称" ref={node} value={value} onChange={(e) => { setValue(e.target.value) }} />
                <button type="button" className="icon-button col-2" onClick={() => {closeSearch(file)}}>
                  <FontAwesomeIcon title="关闭" size="lg" icon={faTimes} />
                </button>
              </>
            }
          </li>
        })
      }
    </ul>
  )
}

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onFileEdit: PropTypes.func
}

export default FileList