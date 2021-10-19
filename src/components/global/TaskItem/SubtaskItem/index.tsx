// Packages:
import { useState, useCallback } from 'react'
import { useInput } from '../../../../hooks/use-input'


// Typescript:
import { ISubtaskItemProps } from './types'


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
const SubtaskItem = ({ subtask, updateSubtask }: ISubtaskItemProps) => {
  // State:
  const [ isSubtaskDone, setIsSubtaskDone ] = useState(subtask.isDone)
  const [ isEditing, setIsEditing ] = useState(subtask.title === '')
  const [ canToggleSubtaskDone ] = useState(true)
  const { value: subtaskTitle, bind: bindSubtaskTitle } = useInput(subtask.title)
  const [ oldTaskTitle, setOldTaskTitle ] = useState<string | undefined>(undefined)
  const [ isSubtaskDeleted, setIsSubtaskDeleted ] = useState({ transitionSet: false, shouldTransition: false, transitioned: false })

  // Functions:
  const onSubtaskTitleEdited = useCallback(() => {
    if (subtaskTitle.length > 0) {
      setIsEditing(false)
      updateSubtask(subtask._id, { title: subtaskTitle })
    }
  }, [ subtask._id, subtaskTitle, updateSubtask ])

  // Return:
  return (
    <Wrapper>
      <Edge style={{ marginLeft: '0.5rem' }}>
        <Checkbox
          isChecked={ isSubtaskDone }
          isClickable={ !isEditing }
          onClick={() => {
            if (!isEditing && canToggleSubtaskDone) {
              setIsSubtaskDone(!isSubtaskDone)
              updateSubtask(subtask._id, { isDone: !isSubtaskDone })
            }
          }}
        >
          <CheckmarkIcon isvisible={ `${ isSubtaskDone }` } />
        </Checkbox>
      </Edge>
      <TaskTitle isNotPointy={ true }>
        {
          isEditing ?
            <TitleInput type='text' placeholder={ 'add a new subtask' } { ...bindSubtaskTitle } autoFocus={ isEditing } />
          :
            <Title
              isStrikethrough={ isSubtaskDone }
              style={{ color: SECONDARY_COLORS.ELEMENT.ACTIVE.DARK.hex() }}
            >
              { subtaskTitle }
            </Title>
        }
      </TaskTitle>
      <OptionsEdge isVisible={ true } style={{ marginRight: '0.5rem' }}>
        {
          isEditing ?
            <DoneIcon isvisible={ `${ subtaskTitle.length > 0 }` } onClick={ onSubtaskTitleEdited } />
          :
            <EditIcon isvisible={ `${ !isSubtaskDone }` } onClick={
                () => {
                  setOldTaskTitle(subtaskTitle)
                  setIsEditing(true)
                }
              }
            />
        }
        <DeleteIcon isvisible={ `${ isSubtaskDone && !isEditing }` } onClick={ () => setIsSubtaskDeleted({ ...isSubtaskDeleted, transitionSet: true }) } />
      </OptionsEdge>
    </Wrapper>
  )
}


// Exports:
export default SubtaskItem
