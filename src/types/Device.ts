
export interface DeviceRow {
    id: number;
    name: string;
    description: string | null;
    temperature: number | null;
    humidity: number | null;
    timestamp: string | null;
}

export interface CreateDeviceDto {
    name: string;
    token: string;
    description?: string;
}
