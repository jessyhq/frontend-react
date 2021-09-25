// Constants:
const TASK_NAMES = [
  'brainstorm productivity ideas',
  'finish maths homework',
  'print agendas',
  'pet a dog',
  'pet a cat',
  'pet a dog AND a cat',
  'call up classmates for notes',
  'clear up the backlog',
  'procrastinate... jk',
  'complete the assignment',
  'call jeff',
  'call jenny',
  'pretend to care about uni',
  'drink 48 cups of coffee',
  'somehow finish homework',
  'revise study new material',
  'call jeff and ask for notes',
  'call jenny and ask for notes',
]


// Exports:
export const generateRandomTaskName = () => TASK_NAMES[ Math.floor(Math.random() * TASK_NAMES.length) ]
