// Packages:
import { useRef, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useInput } from '../../../hooks/use-input'
import useOuterContextMenu from '../../../hooks/use-outer-context-menu'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { playButtonPress } from '../../../util/soundEffects'
import { useUnmount } from 'react-use'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Lottie from 'react-lottie-player/dist/LottiePlayerLight'
// import Lottie from 'react-lottie-player'


// Typescript:
import { IReduxState } from '../../../redux/state/types'
import { TSubtask, TTask } from '../../../types/taskItem'
import { TASK_SUBSECTION } from './types'
import { IObjectStoreExtensionTodoList } from '../../../indexedDB/types'
import { PRIORITY_VALUES } from '../../global/PriorityInput/types'


// Constants:
import { OBJECT_STORE, EXTENSION_TYPE } from '../../../constants/indexedDB/objectStores'


// Components:
import WindowControls from '../../global/WindowControls'
import TaskItem from '../../global/TaskItem'
import FocusedTaskItem from '../../global/TaskItem/FocusedTaskItem'
import PriorityInput from '../../global/PriorityInput'
import SubtaskItem from '../../global/TaskItem/SubtaskItem'


// Redux:
import { updateGlobalContextMenuTarget } from '../../../redux/actions/global'
import { updateIndexedDBObjectStore } from '../../../redux/actions/indexedDB'


// Styles:
import {
  Wrapper,
  TopBarTitle,
  MainArea,
  SearchBar,
  SearchInput,
  SearchIcon,
  OptionsBar,
  ActionButton,
  OptionsIcon,
  LevelsArea,
  Projects,
  Project,
  ProjectTitle,
  Board,
  BoardTitle,
  RightArrow,
  ItemCount,
  LastEdited,
  TopBar,
  BottomBar,
  GoBackIcon,
  ActionButtons,
  Tasks,
  TasksContainer,
  AddTask,
  TaskDetails,
  DescriptionContainer,
  Description,
  OptionsSection,
  TagsField,
  TaskSubsectionSelector,
  TaskSubsectionOption,
  TaskSubsection
} from './styles'


interface IInternalRouteHistoryObject {
  _id: string
  icon: string
  name: string
}

// Functions:
const TodoList = ({ _id }: { _id: string }) => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useOuterContextMenu((e) => {
    if (contextTarget[ _id ] === EXTENSION_TYPE.TODO_LIST) dispatch(updateGlobalContextMenuTarget({ [_id ]: undefined }))
  })
  const lottieJSON = useRef<object | undefined>(undefined)

  // State:
  const localTodoListState = useSelector((state: IReduxState) => state.indexedDB.objectStores.extensions.todo_list[ _id ])
  const contextTarget = useSelector((state: IReduxState) => state.global.contextMenu.target)
  const [ hasLocalStateLoaded, setHasLocalStateLoaded ] = useState(false)
  const [ internalRouteHistory, setInternalRouteHistory ] = useState<IInternalRouteHistoryObject[]>([{ _id: 'projects', icon: '✨', name: 'projects' }])
  const [ showLevel, setShowLevel ] = useState({ PROJECTS: true, BOARD: false, TASK: false })
  const [ tasks, setTasks ] = useState<TTask[]>([])
  const [ tasksMetadata, setTasksMetadata ] = useState({ done: 0, length: tasks.length })
  const [ taskIndexBeingDragged, setTaskIndexBeingDragged ] = useState<number | undefined>(undefined)
  const { value: taskDescription, bind: bindTaskDescription } = useInput('')
  const [ currentTaskSubsectionSelected, setCurrentTaskSubsectionSelected ] = useState(TASK_SUBSECTION.SUBTASKS)
  const [ subtasks, setSubtasks ] = useState<TSubtask[]>([])

  // Functions:
  const handleOnBoardClick = useCallback(async (_id: string, icon: string, name: string) => {
    setShowLevel({ ...showLevel, BOARD: true })
    setInternalRouteHistory([ ...internalRouteHistory, { _id, icon, name } ])
    await new Promise(resolve => setTimeout(resolve, 250))
    setShowLevel({ ...showLevel, BOARD: true, PROJECTS: false })
  }, [ internalRouteHistory, showLevel ])

  const handleGoBack = useCallback(async (targetLevel: number) => {
    if (targetLevel === 1) {
      setShowLevel({ ...showLevel, PROJECTS: true })
      setInternalRouteHistory(internalRouteHistory.slice(0, -1))
      await new Promise(resolve => setTimeout(resolve, 250))
      setShowLevel({ ...showLevel, PROJECTS: true, BOARD: false })
    }
  }, [ internalRouteHistory, showLevel ])

  const reorderTasks = useCallback((tasks: TTask[], startIndex, endIndex) => {
    const newTasks = Array.from(tasks)
    const [ removed ] = newTasks.splice(startIndex, 1)
    newTasks.splice(endIndex, 0, removed)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    return newTasks
  }, [ _id, dispatch, localTodoListState ])

  const onDragEnd = useCallback((result) => {
    setTaskIndexBeingDragged(undefined)
    if (!result.destination) return
    setTasks(reorderTasks(
      tasks,
      result.source.index,
      result.destination.index
    ))
  }, [ reorderTasks, tasks ])

  const updateTask = useCallback((taskID: string, newTask: Partial<TTask>) => {
    const newTasks = tasks, taskIndex = newTasks.findIndex(task => task._id === taskID)
    newTasks[ taskIndex ] = { ...newTasks[ taskIndex ], ...newTask }
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    if (newTask.isDone !== undefined) {
      if (newTask.isDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done + 1 })
      else setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1 })
    }
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  const addTask = useCallback(() => {
    const newTasks = tasks
    newTasks.unshift({
      _id: (Math.random() + 1).toString(36).substring(2),
      isDone: false,
      parentID: _id,
      time: {
        createdAt: Date.now(),
        lastEdited: Date.now()
      },
      title: ''
    })
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length + 1 })
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  const deleteTask = useCallback((taskID: string) => {
    const newTasks = tasks.filter(task => task._id !== taskID), taskToBeDeleted = tasks[ tasks.findIndex(task => task._id === taskID) ]
    setTasks(newTasks)
    dispatch(updateIndexedDBObjectStore({
      [ EXTENSION_TYPE.TODO_LIST ]: {
        [ _id ]: {
          ...localTodoListState,
          tasks: newTasks,
          time: {
            ...localTodoListState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionTodoList
    }, OBJECT_STORE.EXTENSIONS))
    if (taskToBeDeleted.isDone) setTasksMetadata({ ...tasksMetadata, done: tasksMetadata.done - 1, length: tasksMetadata.length - 1 })
    else setTasksMetadata({ ...tasksMetadata, length: tasksMetadata.length - 1 })
  }, [ _id, dispatch, localTodoListState, tasks, tasksMetadata ])

  const handleTaskItemClick = useCallback(async (taskID: string, isTaskDone: boolean, name: string) => {
    setShowLevel({ ...showLevel, TASK: true })
    setInternalRouteHistory([ ...internalRouteHistory, { _id: taskID, icon: isTaskDone ? '✅' : '🖊️', name } ])
    await new Promise(resolve => setTimeout(resolve, 250))
    setShowLevel({ ...showLevel, TASK: true, BOARD: false })
  }, [ internalRouteHistory, showLevel ])

  const updateSubtask = useCallback((subtaskID: string, newSubtask: Partial<TSubtask>) => {
    const newSubtasks = subtasks, subtaskIndex = newSubtasks.findIndex(subtask => subtask._id === subtaskID)
    newSubtasks[ subtaskIndex ] = { ...newSubtasks[ subtaskIndex ], ...newSubtask }
    setSubtasks(newSubtasks)
  }, [])

  // Effects:
  useEffect(() => {
    (async () => lottieJSON.current = await (await fetch('https://assets5.lottiefiles.com/packages/lf20_rovf9gzu.json')).json())()
  }, [])

  useEffect(() => {
    if (localTodoListState && !hasLocalStateLoaded) {
      setTasks(localTodoListState.tasks)
      setTasksMetadata({
        done: localTodoListState.tasks.filter(task => task.isDone).length,
        length: localTodoListState.tasks.length
      })
      setHasLocalStateLoaded(true)
    }
  }, [ _id, contextTarget, dispatch, hasLocalStateLoaded, localTodoListState ])

  useUnmount(() => { if (contextTarget[ _id ] !== undefined) dispatch(updateGlobalContextMenuTarget({ [ _id ]: undefined })) })

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      onContextMenu={() => { if (!contextTarget[ _id ]) dispatch(updateGlobalContextMenuTarget({ [ _id ]: EXTENSION_TYPE.TODO_LIST })) }}
    >
      <TopBar>
        <TopBarTitle><span style={{ marginRight: '0.25rem' }}>{ internalRouteHistory[ internalRouteHistory.length - 1 ]?.icon }</span><span>{ internalRouteHistory[ internalRouteHistory.length - 1 ]?.name }</span> - <b>tasks</b></TopBarTitle>
        <WindowControls />
      </TopBar>
      <Lottie
        animationData={ lottieJSON.current }
        loop={ false }
        play
        style={{ position: 'absolute', zIndex: -1, width: '100%', height: '100%' }}
      />
      <MainArea className='draggableCancel'>
        <SearchBar>
          <SearchIcon />
          <SearchInput type='text' placeholder='search for a project or a board' />
        </SearchBar>
        <OptionsBar>
          <ActionButtons>
            <ActionButton
              isEnabled={ true }
              isVisible={ internalRouteHistory.length === 1 }
              style={{ zIndex: showLevel.PROJECTS ? 0 : -1  }}
            >+ add a new project</ActionButton>
            <ActionButton
              isEnabled={ false }
              isVisible={ internalRouteHistory.length > 1 }
              style={{ left: 0, zIndex: (showLevel.BOARD || showLevel.TASK) ? 0 : -1 }}
              onClick={ () => handleGoBack(1) }
            >
              <GoBackIcon style={{ marginBottom: '-0.1rem' }} />
              { internalRouteHistory[ internalRouteHistory.length - 2 ]?.icon } { internalRouteHistory[ internalRouteHistory.length - 2 ]?.name }
            </ActionButton>
          </ActionButtons>
          <OptionsIcon />
        </OptionsBar>
        <LevelsArea>
          <Projects style={{ marginLeft: internalRouteHistory.length === 1 ? 0 : '-100%' }}>
            <Project style={{ marginTop: 0 }}>
              <ProjectTitle><span style={{ marginRight: '0.25rem' }}>🎈</span><span>school</span></ProjectTitle>
              <Board onClick={ () => handleOnBoardClick('chemistry', '⚗️', 'chemistry' ) }>
                <BoardTitle><span style={{ marginRight: '0.25rem' }}>⚗️</span><span>chemistry</span></BoardTitle>
                <RightArrow />
              </Board>
              <Board onClick={ () => handleOnBoardClick('literature', '✍️', 'literature' ) }>
                <BoardTitle><span style={{ marginRight: '0.25rem' }}>✍️️</span><span>literature</span></BoardTitle>
                <RightArrow />
              </Board>
            </Project>
          </Projects>
          <Tasks style={{ marginLeft: internalRouteHistory.length === 1 ? '100%' : internalRouteHistory.length === 2 ? 0 : '-100%' }}>
            <TasksContainer>
              <AddTask>add a new task</AddTask>
              <TaskItem
                index={ 0 }
                key={ '12' }
                task={{
                  _id: '12',
                  isDone: false,
                  parentID: '234',
                  time: {
                    createdAt: Date.now(),
                    lastEdited: Date.now()
                  },
                  title: 'example task item'
                }}
                updateTask={ updateTask }
                deleteTask={ deleteTask }
                handleTaskItemClick={ handleTaskItemClick }
                taskIndexBeingDragged={ taskIndexBeingDragged }
              />
            </TasksContainer>
          </Tasks>
          <TaskDetails style={{ marginLeft: internalRouteHistory.length === 3 ? 0 : '100%' }}>
            <FocusedTaskItem
              task={{
                _id: '12',
                isDone: false,
                parentID: '234',
                time: {
                  createdAt: Date.now(),
                  lastEdited: Date.now()
                },
                title: 'example task item'
              }}
              updateTask={ updateTask }
            />
            <DescriptionContainer><Description placeholder='add a description..' { ...bindTaskDescription } /></DescriptionContainer>
            <OptionsSection>
              <TagsField type='text' placeholder='add #tags' />
              <PriorityInput priority={ PRIORITY_VALUES.NORMAL } />
            </OptionsSection>
            <TaskSubsectionSelector>
              <TaskSubsectionOption
                selected={ currentTaskSubsectionSelected === TASK_SUBSECTION.SUBTASKS }
                style={{ marginRight: '0.1rem' }}
                onClick={ () => setCurrentTaskSubsectionSelected(TASK_SUBSECTION.SUBTASKS) }
              >subtasks</TaskSubsectionOption>
              <TaskSubsectionOption
                selected={ currentTaskSubsectionSelected === TASK_SUBSECTION.COMMENTS }
                style={{ marginLeft: '0.1rem' }}
                onClick={ () => setCurrentTaskSubsectionSelected(TASK_SUBSECTION.COMMENTS) }
              >comments</TaskSubsectionOption>
            </TaskSubsectionSelector>
            <TaskSubsection>
              <SubtaskItem
                subtask={{
                  _id: '12',
                  isDone: false,
                  taskID: '23',
                  time: {
                    createdAt: Date.now(),
                    lastEdited: Date.now()
                  },
                  title: 'example subtask item'
                }}
                updateSubtask={ updateSubtask }
              />
            </TaskSubsection>
          </TaskDetails>
        </LevelsArea>
      </MainArea>
      <BottomBar>
        <ItemCount>2 projects</ItemCount>
        <LastEdited>last edited at 7:20 PM</LastEdited>
      </BottomBar>
    </Wrapper>
  )
}


// Exports:
export default TodoList
