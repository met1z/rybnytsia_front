export interface SidebarItem {
  label: string
  icon?: string
  to?: string
  target?: string
  style?: string
  class?: string
  separator?: boolean
  badge?: string
  url?: string
  disabled?: boolean
  visible?: boolean
  items?: SidebarItem[]
}
