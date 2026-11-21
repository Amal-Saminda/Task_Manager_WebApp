import React from 'react'

const TaskStatusTabs = ({tabs,activeTab,setActiveTab}) => {
  return <div className='my-2'>
    <div className='flex'>
      {tabs.map((tab) => (
        <button key={tab.lable}
        className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
          activeTab === tab.lable ? 'text-violet-400' : 'text-gray-500 hover:text-gray-700'
        } cursor-pointer`}
        onClick={() => setActiveTab(tab.lable)} >
          
          <div className='flex items-center'>
            <span className='text-xs'>{tab.lable}</span>
            <span 
            className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
             activeTab === tab.lable ? 'text-violet-400' : 'text-gray-500 hover:text-gray-700'
            }`} >
              {tab.count}
            </span>
          </div>
          {activeTab === tab.lable && (
            <div className='absolute bottom-0 left-0 w-full h-0.5 bg-violet-400'></div>
          )}
        </button>
      ))}
    </div>
  </div>
}

export default TaskStatusTabs