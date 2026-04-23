'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface SubscriptionInfo {
  plan: 'standard' | 'enterprise'
  isEnterprise: boolean
  maxStudents: number
  currentStudentCount: number
  isOverQuota: boolean
  loading: boolean
}

export function useSubscription() {
  const [subInfo, setSubInfo] = useState<SubscriptionInfo>({
    plan: 'standard',
    isEnterprise: false,
    maxStudents: 40,
    currentStudentCount: 0,
    isOverQuota: false,
    loading: true
  })

  useEffect(() => {
    const fetchSub = async () => {
      const supabase = createClient()
      
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setSubInfo(prev => ({ ...prev, loading: false }))
        return
      }

      // 2. Get school ID
      const { data: teacher } = await supabase
        .from('teachers')
        .select('school_id')
        .eq('id', user.id)
        .single()

      if (!teacher?.school_id) {
        setSubInfo(prev => ({ ...prev, loading: false }))
        return
      }

      // 3. Get school plan & student count
      const [schoolRes, studentRes] = await Promise.all([
        supabase
          .from('schools')
          .select('plan, max_students')
          .eq('id', teacher.school_id)
          .single(),
        supabase
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', teacher.school_id)
      ])

      const plan = (schoolRes.data?.plan?.toLowerCase() === 'enterprise') ? 'enterprise' : 'standard'
      const maxStudents = schoolRes.data?.max_students || (plan === 'enterprise' ? 99999 : 40)
      const currentCount = studentRes.count || 0

      setSubInfo({
        plan: plan as 'standard' | 'enterprise',
        isEnterprise: plan === 'enterprise',
        maxStudents: maxStudents,
        currentStudentCount: currentCount,
        isOverQuota: plan === 'standard' && currentCount >= maxStudents,
        loading: false
      })
    }

    fetchSub()
  }, [])

  return subInfo
}
