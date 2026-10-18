export type Urgency = 'emergency' | 'high' | 'medium' | 'low'
export type Category = 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Structural' | 'Pest' | 'Locks & Security' | 'Safety' | 'General'
export type RequestStatus = 'new' | 'triaged' | 'assigned' | 'in_progress' | 'resolved'

export interface Property { id: string; name: string; address: string; type: string; units: number; occupied: number; monthlyRent: number; manager: string }
export interface Lease {
  id: string; propertyId: string; unit: string; tenant: string; docId: string
  start: string; end: string; rent: number; deposit: number; noticeDays: number
  renewalClause: string; renewalActionTaken: boolean
}
export interface Request {
  id: string; propertyId: string; unit: string; tenant: string; submitted: string
  text: string; status: RequestStatus
  category: Category; urgency: Urgency; contractorId?: string; resolvedAt?: string
  missingInfo: string[]
}
export interface Contractor { id: string; name: string; trade: string; team: string; phone: string; rating: number; availability: 'available' | 'busy' | 'off' }
export interface Comm { id: string; requestId?: string; propertyId: string; tenant: string; channel: 'email' | 'sms' | 'portal' | 'call'; direction: 'in' | 'out'; at: string; summary: string }
export interface Task { id: string; title: string; due: string; done: boolean; source: 'ai' | 'manual'; link?: string }
export interface Doc { id: string; propertyId: string; name: string; kind: 'Lease' | 'Inspection' | 'Insurance' | 'Notice' | 'Addendum'; uploaded: string; text?: string }
export interface Notification { id: string; at: string; text: string; level: 'info' | 'warn' | 'critical'; read: boolean }
