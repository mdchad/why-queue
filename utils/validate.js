import vest, { test, enforce } from 'vest'

export default vest.create('phone_form', (data = {}) => {
  if (!data.number_of_people) {
    vest.skip('number_of_people')
  }

  test('number_of_people', 'Must be at least 1 person', () => {
    enforce(data.number_of_people).isNotEmpty()
  })

  test('number_of_people', 'Must be at least 1 person', () => {
    enforce(data.number_of_people).greaterThan(0)
  })

  test('number_of_people', 'Maximum 10 people', () => {
    enforce(data.number_of_people).lessThanOrEquals(10)
  })
})
