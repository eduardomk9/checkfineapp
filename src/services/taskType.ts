import api from './api';
import { CreateTaskRequest, OptionType, TaskTypeDto } from './types';

export const createTaskType = async (token: string, createTaskRequest: CreateTaskRequest): Promise<number> => {
    const formData = new FormData();
    formData.append('title', createTaskRequest.title);
    if (createTaskRequest.description) {
        formData.append('description', createTaskRequest.description);
    }
    if (createTaskRequest.attachments) {
        createTaskRequest.attachments.forEach((file) => {
            formData.append('attachments', file); 
        });
    }
    if (createTaskRequest.taskTypeOptions) {
        createTaskRequest.taskTypeOptions.forEach((option, index) => {
            formData.append(`taskTypeOptions[${index}][name]`, option.name);
            formData.append(`taskTypeOptions[${index}][idOpTy]`, option.idOpTy.toString());
            formData.append(`taskTypeOptions[${index}][isMandatory]`, option.isMandatory.toString());
            if (option.idTree) {
                formData.append(`taskTypeOptions[${index}][idTree]`, option.idTree.toString());
            }
        });
    }

    const response = await api.post<number>('/task/create-task', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getTaskTypes = async (token: string): Promise<TaskTypeDto[]> => {
    const response = await api.get<TaskTypeDto[]>('/task/get-task-types', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getOptionTypes = async (token: string): Promise<OptionType[]> => {
    const response = await api.get<OptionType[]>('/task/get-option-types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

export const getTaskTypeById = async (token: string, idTaskType: number): Promise<TaskTypeDto> => {
    const response = await api.get<TaskTypeDto>(`/task/get-task-type/${idTaskType}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteTaskType = async (token: string, idTaskType: number): Promise<boolean> => {
    const response = await api.delete<boolean>(`/task/delete-task-type/${idTaskType}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateTaskType = async (token: string, updateTaskRequest: FormData): Promise<TaskTypeDto> => {
    const response = await api.put<TaskTypeDto>('/task/update-task-type', updateTaskRequest, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};