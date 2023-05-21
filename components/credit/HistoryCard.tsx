import { dateFromNow } from '@/lib/utils'
import React from 'react'
import { CreditHistory } from 'types'
import { formatDuration } from 'utils'
interface HistoryCardProps {
    history: CreditHistory
}
const HistoryCard = ({ history }: HistoryCardProps) => {
    return <div className='flex flex-row justify-between mt-4'>
        <div className='flex flex-col'>
            <div className='dark:text-white text-xl'>{history.name === '' ? 'Unknown' : history.name}</div>
            <div className='dark:text-white text-sm opacity-70'>{dateFromNow(history.create_at)}</div>
        </div>
        <div className='flex flex-col items-end'>
            <div className='dark:text-white text-lg'>Credit {history.credit}</div>
            <div className='dark:text-white text-sm opacity-70'>{formatDuration(history.audio_length / 1000)}</div>
        </div>
    </div>
}

export default HistoryCard