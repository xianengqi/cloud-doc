import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

const BottomBtn = ({ text, colorClass, icon, onBtnClick }) => (
  // 这里面不需要写逻辑，就直接返回jsx语法了
  <>
    <button type="button" className={`btn btn-block no-border ${colorClass}`} onClick={onBtnClick}>
      <FontAwesomeIcon className="mr-2" icon={icon}/>
      {text}
    </button>
  </>
)

// 类型检查
BottomBtn.propTypes = {
  onBtnClick: PropTypes.func,
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.object.isRequired
}
BottomBtn.defaultProps = {
  text: '新建'
}
export default BottomBtn