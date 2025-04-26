'use client'
import { Pagination, Stack, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DetectionLogsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const router = useRouter()

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
  }

  const getDetectionLogs = async ({
    page,
    pageSize,
  }: {
    page: number
    pageSize: number
  }) => {
    const response = await fetch(
      `http://localhost:8000/get_detection_log?page=${page}&page_size=${pageSize}`,
    )
    return response.json()
  }

  const { data: getDetectionLogsData } = useQuery({
    queryKey: ['get_detection_log', page, pageSize],
    queryFn: () => getDetectionLogs({ page, pageSize }),
  })

  const pageCount = Math.ceil(getDetectionLogsData?.total_count / pageSize)

  console.log('getDetectionLogsData: ', getDetectionLogsData)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-6"
    >
      <Button
        onClick={() => router.push('/')}
        variant="contained"
        sx={{
          backgroundColor: '#0A84FF',
          '&:hover': { backgroundColor: '#006EDC' },
          color: '#fff',
        }}
      >
        🏠 Home 🏠
      </Button>

      <motion.div
        className="space-y-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {getDetectionLogsData?.items.map((item: any) => (
          <motion.div
            key={item.id}
            className="bg-[#1C1C1E] p-4 rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <p className="text-lg font-semibold">file name: {item.file_name}</p>
            <p>message: {item.message}</p>
            <p>created at: {new Date(item.created_at).toLocaleString()}</p>
            <motion.img
              src={`http://localhost:8000/log/${item.result_image}`}
              alt={item.file_name}
              className="w-full h-auto rounded-md mt-2 sm:max-w-md"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <ul className="mt-4 space-y-2">
              {item.detections.map((detection: any, index: number) => (
                <li key={index} className="bg-[#2C2C2E] p-2 rounded-md">
                  <p>class name: {detection.class_name}</p>
                  <p>confidence: {detection.confidence}</p>
                  <p>bbox: {detection.bbox.join(', ')}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="bg-[#1C1C1E]/80 backdrop-blur-lg px-4 py-3 rounded-full border border-[#38383A] shadow-xl mt-6 sm:px-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Stack spacing={2}>
          <Pagination
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: '#0A84FF',
                },
              },
            }}
            page={page}
            count={pageCount === 0 ? 1 : pageCount}
            boundaryCount={1}
            siblingCount={1}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </motion.div>
    </motion.div>
  )
}
