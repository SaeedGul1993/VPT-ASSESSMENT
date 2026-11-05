import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { FieldWorker } from "../types/models";
import baseApi from "./api";
import { LIST, listTagOf } from "./apiTags";

type CreateFieldWorkerBody = {
  name: string;
  email: string;
  password: string;
  areaId?: string | null;
};

export const FieldWorkersService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFieldWorkers: builder.query<
      ApiSuccess<{ workers: FieldWorker[] }>,
      void
    >({
      query: () => ({
        url: apiEndpoints.fieldWorkers.list,
        method: apiMethod.get,
      }),
      providesTags: listTagOf("FieldWorkers"),
    }),
    createFieldWorker: builder.mutation<
      ApiSuccess<{ worker: FieldWorker }>,
      CreateFieldWorkerBody
    >({
      query: (body) => ({
        url: apiEndpoints.fieldWorkers.create,
        method: apiMethod.post,
        body,
      }),
      invalidatesTags: [
        { type: "FieldWorkers", id: LIST },
        { type: "Dashboard", id: LIST },
      ],
    }),
    updateFieldWorkerStatus: builder.mutation<
      ApiSuccess<{ worker: FieldWorker }>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: apiEndpoints.fieldWorkers.status(id),
        method: apiMethod.patch,
        body: { isActive },
      }),
      invalidatesTags: [
        { type: "FieldWorkers", id: LIST },
        { type: "Dashboard", id: LIST },
      ],
    }),
    assignFieldWorkerArea: builder.mutation<
      ApiSuccess<{ worker: FieldWorker }>,
      { id: string; areaId: string | null }
    >({
      query: ({ id, areaId }) => ({
        url: apiEndpoints.fieldWorkers.area(id),
        method: apiMethod.patch,
        body: { areaId },
      }),
      invalidatesTags: listTagOf("FieldWorkers"),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFieldWorkersQuery,
  useCreateFieldWorkerMutation,
  useUpdateFieldWorkerStatusMutation,
  useAssignFieldWorkerAreaMutation,
} = FieldWorkersService;
