import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { faPlus, faFileImport, faSave } from '@fortawesome/free-solid-svg-icons'
import uuidv4 from 'uuid/dist/v4'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TableList from './components/TableList'
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'

const { join } = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')

const fileStore = new Store({'name': 'Files Data'})

const saveFilesToStore = (files) => {
  // 我们不需要把所有的信息都存储到文件数据库里面
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file
    result[id] = {
      id,
      path,
      title,
      createdAt
    }
    return result
  }, {})
  fileStore.set('files', filesStoreObj)
}

function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFileID] = useState('')
  const [openedFileIDs, setopenedFileIDs] = useState([])
  const [unsaveFileIDs, setunsaveFileIDs] = useState([])
  const [searchedFiles, setSearchedFiles] = useState([])
  const filesArr = objToArr(files)
  const savedLocation = remote.app.getPath('documents')

  const activeFile = files[activeFileID]
  const fileClick = (fileID) => {
    setActiveFileID(fileID)
    if (!openedFileIDs.includes(fileID)) {
      setopenedFileIDs([ ...openedFileIDs, fileID ])
    }
  }
  const tabList = (fileId) => {
    setActiveFileID(fileId)
  }
  const tabClose = (id) => {
    const tabsWithout = openedFileIDs.filter(fileID => fileID !== id)
    setopenedFileIDs(tabsWithout)
    if (tabsWithout.length > 0) {
      setActiveFileID(tabsWithout[0])
    } else {
      setActiveFileID('')
    }
  }
  const fileChange = (id, value) => {
    const newFile = { ...files[id], body: value }
    setFiles({ ...files, [id]:  newFile})
    if (!unsaveFileIDs.includes(id)) {
      setunsaveFileIDs([ ...unsaveFileIDs, id ])
    }
  }
  const deleteFile = (id) => {
    fileHelper.deleteFile(files[id].path).then(() => {
      delete files[id]
      setFiles(files)
      saveFilesToStore(files)
      tabClose(id)
    })
  }
  const updateFIleName = (id, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`)
    const midifiedFile = { ...files[id], title, isNew: false, path: newPath }
    const newFiles = { ...files, [id]: midifiedFile }
    if (isNew) {
      // 写入
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        // 新建保存的路径
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`)
      // 重命名
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles)
        saveFilesToStore(newFiles)
      })
    }
  }
  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter(file => file.title.includes(keyword))
    setSearchedFiles(newFiles)
  }
  const openedFiles = openedFileIDs.map(openID => {
    return files[openID]
  })
  const fileListArr = (searchedFiles.length > 0) ? searchedFiles : filesArr
  const createNewFile = () => {
    const newId = uuidv4()
    const newFile = {
      id: newId,
      title: '',
      body: '## 请输入markdown',
      createdAt: new Date().getTime(),
      isNew: true
    }
    setFiles({ ...files,  [newId]: newFile })
  }
  const saveCurrentFile = () => {
    // 文件保存
    fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`),
      activeFile.body
    ).then(() => {
      setunsaveFileIDs(unsaveFileIDs.filter(id => id !== activeFile.id))
    })
  }
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={fileSearch}
          />
          <FileList
            files={fileListArr}
            onFileClick={fileClick}
            onFileDelete={deleteFile}
            onFileEdit={updateFIleName}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createNewFile}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onBtnClick={(e) => { console.log('onBtnImport =>', e); }}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {
            !activeFile && <div className="start-page">选择或者创建新的 markdown 文档</div>
          }
          { activeFile &&
            <>
              <TableList
                files={openedFiles}
                unsaveIds={unsaveFileIDs}
                onTabClick={tabList}
                onCloseTab={tabClose}
                activeId={activeFileID}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => { fileChange(activeFile.id, value) }}
                options={{
                  minHeight: '515px'
                }}
              />
              <BottomBtn
                text="保存"
                colorClass="btn-primary"
                icon={faSave}
                onBtnClick={saveCurrentFile}
              />
            </>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
