import React, { useState, useEffect, useRef} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ({ title, onFileSearch }) => {
  const [ inputActive, setInputActive ] = useState(false)
  const [ value, setValue ] = useState('')
  const enterPressed = useKeyPress(13)
  const escPressed = useKeyPress(27)
  let node = useRef(null)
  // 拿到键盘的触发事件
  const closeSearch = () => {
    setInputActive(false)
    setValue('')
    onFileSearch('')
  }
  useEffect(() => {
    // 引入自定义hook
    if (enterPressed && inputActive) {
      onFileSearch(value)
    }
    if (escPressed && inputActive) {
      closeSearch()
    }
  })
  useEffect(() => {
    if (inputActive) {
      node.current.focus()
    }
  }, [inputActive])
  return (
    <div className="alert alert-primary">
      {
        !inputActive &&
        <div className="d-flex justify-content-between align-items-center mb-0">
          <span>{ title }</span>
          <button type="button" className="icon-button" onClick={ () => { setInputActive(true) } }>
            <FontAwesomeIcon title="搜索" size="lg" icon={faSearch} />
          </button>
        </div>
      }
      {
        inputActive &&
        <>
        <div className="d-flex justify-content-between align-items-center">
          <input  className="form-control" value={value} ref={node} onChange={(e) => {setValue(e.target.value)} } />
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon title="关闭" size="lg" icon={faTimes} />
          </button>
        </div>
        </>
      }
    </div>
  )
}

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: '我的云文档'
}

export default FileSearch