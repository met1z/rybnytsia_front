import dayjs from 'dayjs'

export const shortDate = ({ data }: { data: Date | string | number }) => dayjs(data).format('LL')
