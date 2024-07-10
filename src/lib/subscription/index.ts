import { User } from '../db/drizzle/types'

const retrieveActiveSubscription = (user: User | null) =>
  user?.subscriptions?.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  )

const retrieveInactiveSubscription = (user: User | null) => {
  const inactiveSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status !== 'active' && sub.status !== 'trialing',
  )

  if (inactiveSubscriptions) {
    return user?.subscriptions?.find(
      (sub) => sub.status !== 'active' && sub.status !== 'trialing',
    )
  }
}

const retrieveUnpaidSubscription = (user: User | null) => {
  const unpaidSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status === 'unpaid' || sub.status === 'past_due',
  )

  if (unpaidSubscriptions) {
    return user?.subscriptions?.find(
      (sub) => sub.status === 'unpaid' || sub.status === 'past_due',
    )
  }
}

const retrieveIncompleteSubscription = (user: User | null) => {
  const unpaidSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status === 'incomplete' || sub.status === 'incomplete_expired',
  )

  if (unpaidSubscriptions) {
    return user?.subscriptions?.find(
      (sub) =>
        sub.status === 'incomplete' || sub.status === 'incomplete_expired',
    )
  }
}

export {
  retrieveActiveSubscription,
  retrieveInactiveSubscription,
  retrieveUnpaidSubscription,
  retrieveIncompleteSubscription,
}
