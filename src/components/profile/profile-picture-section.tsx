'use client'

import {
  Button,
  Card,
  CardContent,
} from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'
import { useRef, useState } from 'react'

export const ProfilePictureSection = () => {
  const [profileImage, setProfileImage] = useState<string>(
    '/assets/profile.svg',
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageReset = () => {
    setProfileImage('/assets/profile.svg')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Change Profile</h2>
          <p className="text-muted-foreground text-sm">
            Change your profile picture from here
          </p>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="default"
              >
                Upload
              </Button>
              <Button onClick={handleImageReset} variant="outline">
                Reset
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-muted-foreground text-xs">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
