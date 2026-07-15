import api from '@/shared/api/client'

export interface CatalogueFile {
  id: string
  filename: string
  mimeType: string
  fileSizeBytes: number
  createdAt: string
}

interface BusinessProfile {
  organizationId: string
  brandName: string | null
  websiteUrl: string | null
  facebookPageUrl: string | null
  instagramPageUrl: string | null
  businessDescription: string | null
  catalogueFiles: CatalogueFile[]
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CompleteBusinessPayload {
  brandName: string
  websiteUrl?: string | null
  facebookPageUrl?: string | null
  instagramPageUrl?: string | null
  businessDescription: string
}

export interface BusinessResponse {
  profile: BusinessProfile
}

export interface UploadCatalogueResponse {
  file: CatalogueFile
  profile: BusinessProfile
}

export class BusinessService {
  static async getBusiness(): Promise<BusinessResponse> {
    const response = await api.get<BusinessResponse>('/business')
    return response.data
  }

  static async completeBusiness(data: CompleteBusinessPayload): Promise<BusinessResponse> {
    const response = await api.post<BusinessResponse>('/business/complete', data)
    return response.data
  }

  static async updateBusiness(data: CompleteBusinessPayload): Promise<BusinessResponse> {
    const response = await api.patch<BusinessResponse>('/business', data)
    return response.data
  }

  static async uploadCatalogue(file: File): Promise<UploadCatalogueResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadCatalogueResponse>('/business/catalogue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60_000,
    })

    return response.data
  }

  static async deleteCatalogue(fileId: string): Promise<BusinessResponse> {
    const response = await api.delete<BusinessResponse>(`/business/catalogue/${fileId}`)
    return response.data
  }
}
