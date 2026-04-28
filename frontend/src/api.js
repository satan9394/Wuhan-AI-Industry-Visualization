import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchEnterprises = async (page = 1, limit = 10, search = '', region = '', category = '', subcategory = '') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enterprises`, {
            params: { page, limit, search, region, category, subcategory }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching enterprises:", error);
        throw error;
    }
};

export const exportEnterprises = async (search = '', region = '', category = '', subcategory = '') => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enterprises/export`, {
            params: { search, region, category, subcategory },
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error("Error exporting enterprises:", error);
        throw error;
    }
};

export const fetchRegionStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/region`);
        return response.data;
    } catch (error) {
        console.error("Error fetching region stats:", error);
        throw error;
    }
};

export const fetchCategoryStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/category`);
        return response.data;
    } catch (error) {
        console.error("Error fetching category stats:", error);
        throw error;
    }
};

export const fetchRegionCategoryStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/region-category`);
        return response.data;
    } catch (error) {
        console.error("Error fetching region-category stats:", error);
        throw error;
    }
};

export const fetchChainStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/chain`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chain stats:", error);
        throw error;
    }
};

export const fetchKeywordsStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/keywords`);
        return response.data;
    } catch (error) {
        console.error("Error fetching keywords stats:", error);
        return [];
    }
};

export const fetchInfraStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/infra/stats`);
        return response.data;
    } catch (error) {
        console.error("Error fetching infra stats:", error);
        return null;
    }
};

export const fetchChainGraph = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chain/graph`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chain graph:", error);
        return null;
    }
};

export const fetchEnterpriseDetail = async (name) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/enterprise/${encodeURIComponent(name)}/detail`);
        return response.data;
    } catch (error) {
        console.error("Error fetching enterprise detail:", error);
        throw error;
    }
};

export const fetchIndustryAnalysis = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/industry/analysis`);
        return response.data;
    } catch (error) {
        console.error("Error fetching industry analysis:", error);
        throw error;
    }
};

export const fetchUnusedMd = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/md/unused`);
        return response.data;
    } catch (error) {
        console.error("Error fetching unused md:", error);
        return { items: [] };
    }
};

export const fetchInnovationStats = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/stats/innovation`);
        return response.data;
    } catch (error) {
        console.error("Error fetching innovation stats:", error);
        return null;
    }
};

export const fetchAtlasSummary = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/atlas/summary`);
        return response.data;
    } catch (error) {
        console.error("Error fetching atlas summary:", error);
        return { total: 0, level1: [], level2: [], level3: [], regions: [] };
    }
};

export const fetchAtlasEnterprises = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/atlas/enterprises`);
        return response.data;
    } catch (error) {
        console.error("Error fetching atlas enterprises:", error);
        return [];
    }
};

export const fetchApplicationCases = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cases`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cases:", error);
        return [];
    }
};
