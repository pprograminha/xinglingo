import { User } from '../db/drizzle/types'

const retrieveSubscription = (user?: User | null) => user?.subscriptions?.[0]
const retrieveActiveSubscription = (
  user?: User | null,
  subscription?: NonNullable<User['subscriptions']>[number] | null,
) => {
  if (
    subscription &&
    (subscription.status === 'active' || subscription.status === 'trialing')
  ) {
    return subscription
  }

  return user?.subscriptions?.find(
    (sub) => sub.status === 'active' || sub.status === 'trialing',
  )
}

const retrieveInactiveSubscription = (user?: User | null) => {
  const inactiveSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status !== 'active' && sub.status !== 'trialing',
  )

  if (inactiveSubscriptions) {
    return user?.subscriptions?.find(
      (sub) => sub.status !== 'active' && sub.status !== 'trialing',
    )
  }
}
const retrieveCancelledSubscription = (user?: User | null) => {
  const cancelledSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status === 'canceled',
  )

  if (cancelledSubscriptions) {
    return user?.subscriptions?.find((sub) => sub.status === 'canceled')
  }
}

const retrieveUnpaidSubscription = (user?: User | null) => {
  const unpaidSubscriptions = user?.subscriptions?.every(
    (sub) => sub.status === 'unpaid' || sub.status === 'past_due',
  )

  if (unpaidSubscriptions) {
    return user?.subscriptions?.find(
      (sub) => sub.status === 'unpaid' || sub.status === 'past_due',
    )
  }
}

const retrieveIncompleteSubscription = (user?: User | null) => {
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
  retrieveCancelledSubscription,
  retrieveInactiveSubscription,
  retrieveIncompleteSubscription,
  retrieveSubscription,
  retrieveUnpaidSubscription,
}
