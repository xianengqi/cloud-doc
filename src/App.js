import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'
import TableList from './components/TableList'

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {console.log(value) }}
          />
          <FileList
            files={defaultFiles}
            onFileClick={(id) => {console.log('click => ', id);}}
            onFileDelete={(id) => {console.log('delete =>', id);}}
            onFileEdit={(id, newValue) => {console.log('edit => ', id, newValue);}}
          />
          <div className="row no-gutters">
            <div className="col">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={(e) => {console.log('onBtn =>', e);}}
              />
            </div>
            <div className="col">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onBtnClick={(e) => {console.log('onBtnImport =>', e);}}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          <TableList
            files={defaultFiles}
            unsaveIds={["1", "2"]}
            onTabClick={(id) => {console.log('tabList => ', id);}}
            onCloseTab={(id) => {console.log('Close => ', id);}}
            activeId="1"
          />
          <SimpleMDE
            value={defaultFiles[0].body}
            onChange={(value) => {console.log('markdown =>', value);}}
            options={{
              minHeight: '515px'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
