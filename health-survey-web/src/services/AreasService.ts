import { apiEndpoints, apiMethod } from "../config/apiConfig";
import type { ApiSuccess } from "../types/api";
import type { Area } from "../types/models";
import baseApi from "./api";
import { LIST, listTagOf } from "./apiTags";

type CreateAreaBody = {
  name: string;
  code: string;
  description?: string | null;
};

type UpdateAreaBody = Partial<CreateAreaBody>;

export const AreasService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAreas: builder.query<ApiSuccess<{ areas: Area[] }>, void>({
      query: () => ({
        url: apiEndpoints.areas.list,
        method: apiMethod.get,
      }),
      providesTags: listTagOf("Areas"),
    }),
    createArea: builder.mutation<ApiSuccess<{ area: Area }>, CreateAreaBody>({
      query: (body) => ({
        url: apiEndpoints.areas.create,
        method: apiMethod.post,
        body,
      }),
      invalidatesTags: listTagOf("Areas"),
    }),
    updateArea: builder.mutation<
      ApiSuccess<{ area: Area }>,
      { id: string; body: UpdateAreaBody }
    >({
      query: ({ id, body }) => ({
        url: apiEndpoints.areas.detail(id),
        method: apiMethod.patch,
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Areas", id: LIST },
        { type: "Areas", id: arg.id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAreasQuery,
  useCreateAreaMutation,
  useUpdateAreaMutation,
} = AreasService;
