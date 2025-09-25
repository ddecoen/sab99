import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Calculate materiality assessments
    const quantitativeMaterial = data.quantitativeThreshold > 0 ? 
      data.monetaryAmount > data.quantitativeThreshold : false
    
    const qualitativeMaterial = data.qualitativeFactors && data.qualitativeFactors.length > 0
    
    let overallMateriality = 'Immaterial'
    if (quantitativeMaterial || qualitativeMaterial) {
      overallMateriality = 'Material'
    } else if (data.monetaryAmount > 0 && !data.quantitativeThreshold) {
      overallMateriality = 'Requires Further Review'
    }
    
    // For out-of-period adjustments, assess both periods
    const priorPeriodMaterial = data.isOutOfPeriod ? quantitativeMaterial : false
    const currentPeriodMaterial = data.isOutOfPeriod ? 
      (data.rolloverAmount > (data.quantitativeThreshold || 0)) : false

    const entry = await prisma.sab99Entry.create({
      data: {
        entryNumber: data.entryNumber,
        description: data.description,
        accountingPeriod: data.accountingPeriod,
        discoveryDate: data.discoveryDate,
        errorOriginPeriod: data.errorOriginPeriod,
        monetaryAmount: data.monetaryAmount,
        accountsAffected: data.accountsAffected,
        quantitativeThreshold: data.quantitativeThreshold,
        quantitativeMaterial,
        qualitativeFactors: data.qualitativeFactors,
        qualitativeMaterial,
        overallMateriality,
        isOutOfPeriod: data.isOutOfPeriod,
        priorPeriodMaterial,
        currentPeriodMaterial,
        ironCurtainAmount: data.ironCurtainAmount || 0,
        rolloverAmount: data.rolloverAmount || 0,
        resolutionMethod: data.resolutionMethod,
        preparedBy: data.preparedBy,
        notes: data.notes,
      }
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error creating entry:', error)
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const entries = await prisma.sab99Entry.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    )
  }
}