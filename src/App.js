import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'

import FileSearch from './components/FileSearch'
import FileList from './components/FileList'
import defaultFiles from './utils/defaultFiles'
import BottomBtn from './components/BottomBtn'

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
        <div className="col-9 bg-primary right-panel">
          <h1>This is the right</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
