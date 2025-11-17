import { getApperClient } from "@/services/apperClient";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
class ProductsService {
  constructor() {
    this.apperClient = null;
  }

  async initClient() {
    if (!this.apperClient) {
      this.apperClient = getApperClient();
    }
    return this.apperClient;
  }

  parseMultiPicklist(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(',').map(v => v.trim());
    return [];
  }

  transformProductData(record) {
    return {
      Id: record.Id,
      name: record.name_c || '',
      description: record.description_c || '',
      price: parseFloat(record.price_c || 0),
      category: record.category_c?.Name || '',
      subcategory: record.subcategory_c || '',
      sizes: this.parseMultiPicklist(record.sizes_c),
      colors: this.parseMultiPicklist(record.colors_c),
images: record.images_c ? record.images_c.map(img => img.url || img.Url || '/api/placeholder/300/400') : ['/api/placeholder/300/400']
    };
  }

  async getAll(filters = {}) {
    try {
  async getAll(filters = {}) {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: false, data: [] };
      }

      const whereConditions = [];

      // Build category filter
      if (filters.category) {
        whereConditions.push({
          FieldName: "category_c",
          Operator: "EqualTo",
          Values: [filters.category]
        });
      }

      // Build search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        whereConditions.push({
          FieldName: "name_c",
          Operator: "Contains",
          Values: [searchTerm]
        });
      }

      // Build price range filter
      const orderBy = [];
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            orderBy.push({ fieldName: "price_c", sorttype: "ASC" });
            break;
          case "price-high":
            orderBy.push({ fieldName: "price_c", sorttype: "DESC" });
            break;
          case "name":
            orderBy.push({ fieldName: "name_c", sorttype: "ASC" });
            break;
          default:
            break;
        }
      }

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: whereConditions,
        ...(orderBy.length > 0 && { orderBy })
      };

      const response = await this.apperClient.fetchRecords('products_c', params);

      if (!response?.success) {
        console.error(response?.message);
        return { success: false, data: [] };
      }

      let products = (response.data || []).map(record => this.transformProductData(record));

      // Apply client-side filtering for complex filters
      if (filters.sizes && filters.sizes.length > 0) {
        products = products.filter(p =>
          filters.sizes.some(size => p.sizes.includes(size))
        );
      }

      if (filters.colors && filters.colors.length > 0) {
        products = products.filter(p =>
          filters.colors.some(color => p.colors.includes(color))
        );
      }

      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice);
      }

      return {
        success: true,
        data: products
      };
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error);
      return { success: false, data: [] };
}
  }

  async getById(id) {
    try {
      if (!this.apperClient) {
        return { success: false, error: "Product not found" };
      }

      const response = await this.apperClient.getRecordById('products_c', parseInt(id), {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!response?.success || !response?.data) {
        return { success: false, error: "Product not found" };
      }

      return {
        success: true,
        data: this.transformProductData(response.data)
      };
    } catch (error) {
      console.error("Error fetching product:", error?.response?.data?.message || error);
      return { success: false, error: "Product not found" };
    }
  }

  async getFeatured() {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: true, data: [] };
      }

      const response = await this.apperClient.fetchRecords('products_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [
          {
            FieldName: "featured_c",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      });

      if (!response?.success) {
        return { success: true, data: [] };
      }

const featured = (response.data || []).map(record => this.transformProductData(record));
      return {
        success: true,
        data: featured
      };
    } catch (error) {
      console.error("Error fetching featured products:", error?.response?.data?.message || error);
      return { success: true, data: [] };
    }
}

  async getRelated(productId, limit = 4) {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: false, error: "Product not found" };
      }
          { field: { Name: "category_c" }, referenceField: { field: { Name: "Name" } } }
        ]
      });

      if (!mainResponse?.success || !mainResponse?.data) {
        return { success: false, error: "Product not found" };
      }

      const mainProduct = mainResponse.data;
      const categoryName = mainProduct.category_c?.Name;

      if (!categoryName) {
        return { success: true, data: [] };
      }

      // Get related products
      const response = await this.apperClient.fetchRecords('products_c', {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "stock_c" } },
          { field: { Name: "featured_c" } },
          { field: { Name: "sizes_c" } },
          { field: { Name: "colors_c" } },
          { field: { Name: "subcategory_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "category_c" }, referenceField: { field: { Name: "Name" } } }
        ],
        where: [
          {
            FieldName: "category_c",
            Operator: "EqualTo",
            Values: [categoryName]
          }
        ],
        pagingInfo: {
          limit: limit + 1,
          offset: 0
        }
      });

      if (!response?.success) {
        return { success: true, data: [] };
      }

      let related = (response.data || [])
        .filter(record => record.Id !== parseInt(productId))
        .slice(0, limit)
.map(record => this.transformProductData(record));

      return {
        success: true,
        data: related
      };
    } catch (error) {
      console.error("Error fetching related products:", error?.response?.data?.message || error);
      return { success: false, error: "Product not found" };
    }
  }

  async getCategories() {
    try {
      await this.initClient();
      if (!this.apperClient) {
        return { success: true, data: [] };
      }

      const response = await this.apperClient.fetchRecords('categories_c', {
        fields: [
          { field: { Name: "Name" } }
        ]
      });

      if (!response?.success) {
if (!response?.success) {
        return { success: true, data: [] };
      }

      const categories = (response.data || []).map(cat => cat.Name).filter(Boolean);
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return { success: true, data: [] };
    }
  }
}

export default new ProductsService();

export default new ProductsService();
}