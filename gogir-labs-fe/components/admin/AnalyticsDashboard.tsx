'use client'

import { BarChart3, TrendingUp, Eye, MousePointerClick, Globe, Calendar } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'

interface AnalyticsStats {
  pageViews: {
    total_views: number
    unique_visitors: number
    top_pages: Array<{ path: string; count: number }>
    views_by_day?: Array<{ day: string; count: number }>
  }
  events: {
    total_events: number
    top_events: Array<{ event_name: string; count: number }>
    events_by_type: Array<{ event_type: string; count: number }>
    events_by_day?: Array<{ day: string; count: number }>
  }
}

interface AnalyticsDashboardProps {
  stats: AnalyticsStats
}

export function AnalyticsDashboard({ stats }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlowCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Eye className="h-8 w-8 text-purple-400" />
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="mb-1 text-3xl font-bold text-white">{stats.pageViews.total_views}</div>
          <div className="text-sm text-gray-400">Total Page Views</div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <Globe className="h-8 w-8 text-blue-400" />
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="mb-1 text-3xl font-bold text-white">
            {stats.pageViews.unique_visitors}
          </div>
          <div className="text-sm text-gray-400">Unique Visitors</div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <MousePointerClick className="h-8 w-8 text-green-400" />
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="mb-1 text-3xl font-bold text-white">{stats.events.total_events}</div>
          <div className="text-sm text-gray-400">Total Events</div>
        </GlowCard>

        <GlowCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <BarChart3 className="h-8 w-8 text-yellow-400" />
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mb-1 text-3xl font-bold text-white">30</div>
          <div className="text-sm text-gray-400">Days Period</div>
        </GlowCard>
      </div>

      {/* Top Pages */}
      {stats.pageViews.top_pages && stats.pageViews.top_pages.length > 0 && (
        <GlowCard className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Top Pages</h2>
          <div className="space-y-4">
            {stats.pageViews.top_pages.slice(0, 10).map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between rounded-lg bg-gray-800/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-2xl font-bold text-purple-400">{index + 1}</span>
                  <span className="text-gray-300">{page.path}</span>
                </div>
                <span className="font-semibold text-white">{page.count} views</span>
              </div>
            ))}
          </div>
        </GlowCard>
      )}

      {/* Top Events */}
      {stats.events.top_events && stats.events.top_events.length > 0 && (
        <GlowCard className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Top Events</h2>
          <div className="space-y-4">
            {stats.events.top_events.slice(0, 10).map((event, index) => (
              <div
                key={event.event_name}
                className="flex items-center justify-between rounded-lg bg-gray-800/50 p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-2xl font-bold text-blue-400">{index + 1}</span>
                  <span className="text-gray-300">{event.event_name}</span>
                </div>
                <span className="font-semibold text-white">{event.count} times</span>
              </div>
            ))}
          </div>
        </GlowCard>
      )}

      {/* Events by Type */}
      {stats.events.events_by_type && stats.events.events_by_type.length > 0 && (
        <GlowCard className="p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">Events by Type</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.events.events_by_type.map((type) => (
              <div key={type.event_type} className="rounded-lg bg-gray-800/50 p-4 text-center">
                <div className="mb-1 text-2xl font-bold text-purple-400">{type.count}</div>
                <div className="text-sm capitalize text-gray-400">{type.event_type}</div>
              </div>
            ))}
          </div>
        </GlowCard>
      )}
    </div>
  )
}
