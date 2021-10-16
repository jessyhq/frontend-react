// Packages:
import React, { useState, useCallback } from 'react'
import { generateRandomTaskName } from '../../../../util/generateRandomTaskName'
import { useInput } from '../../../../hooks/use-input'


// Typescript:
import { IFocusedTaskItemProps } from './types'


// Constants:
import { SECONDARY_COLORS } from '../../../../styles/colors'


// Styles:
import { Wrapper } from './styles'
import {
  Edge,
  Checkbox,
  CheckmarkIcon,
  TaskTitle,
  TitleInput,
  Title,
  OptionsEdge,
  DoneIcon,
  EditIcon,
  DeleteIcon
} from '../styles'


// Functions:
const FocusedTaskItem = ({ task, updateTask }: IFocusedTaskItemProps) => {
  // State:
  const [ isTaskDone, setIsTaskDone ] = useState(task.isDone)
  const [ isEditing, setIsEditing ] = useState(task.title === '')
  const [ canToggleTaskDone, setCanToggleTaskDone ] = useState(true)
  const [ titlePlaceHolder, setTitlePlaceHolder ] = useState(generateRandomTaskName())
  const { value: taskTitle, bind: bindTaskTitle } = useInput(task.title)
  const [ oldTaskTitle, setOldTaskTitle ] = useState<string | undefined>(undefined)
  const [ isTaskDeleted, setIsTaskDeleted ] = useState({ transitionSet: false, shouldTransition: false, transitioned: false })

  // Functions:
  const onTaskTitleEdited = useCallback(() => {
    if (taskTitle.length > 0) {
      setIsEditing(false)
      updateTask(task._id, { title: taskTitle })
    }
  }, [ task._id, taskTitle, updateTask ])

  // Return:
  return (
    <Wrapper>
      <Edge style={{ marginLeft: '0.5rem' }}>
        <Checkbox
          isChecked={ isTaskDone }
          isClickable={ !isEditing }
          onClick={() => {
            if (!isEditing && canToggleTaskDone) {
              setIsTaskDone(!isTaskDone)
              updateTask(task._id, { isDone: !isTaskDone })
            }
          }}
        >
          <CheckmarkIcon isvisible={ `${ isTaskDone }` } />
        </Checkbox>
      </Edge>
      <TaskTitle isNotPointy={ true }>
        {
          isEditing ?
            <TitleInput type='text' placeholder={ titlePlaceHolder } { ...bindTaskTitle } autoFocus={ isEditing } />
          :
            <Title
              isStrikethrough={ isTaskDone }
              style={{ color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() }}
            >
              { taskTitle }
            </Title>
        }
      </TaskTitle>
      <OptionsEdge isVisible={ true } style={{ marginRight: '0.5rem' }}>
        {
          isEditing ?
            <DoneIcon isvisible={ `${ taskTitle.length > 0 }` } onClick={ onTaskTitleEdited } />
          :
            <EditIcon isvisible={ `${ !isTaskDone }` } onClick={
                () => {
                  setOldTaskTitle(taskTitle)
                  setIsEditing(true)
                }
              }
            />
        }
        <DeleteIcon isvisible={ `${ isTaskDone && !isEditing }` } onClick={ () => setIsTaskDeleted({ ...isTaskDeleted, transitionSet: true }) } />
      </OptionsEdge>
    </Wrapper>
  )
}


// Exports:
export default FocusedTaskItem
