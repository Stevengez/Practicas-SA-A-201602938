import customAxios from "./axios"



type Props = {
    method: 'get'|'post'|'put'|'delete',
    path: string,
    params?: any,
    body?: any,
    headers?: any,
    signal?: AbortSignal
}
export const baseQuery = async ({
    method, path, params, body, headers, signal
}:Props) => {

    return await customAxios.request({
        method, url: path, params, data: body, headers, signal
    })
}