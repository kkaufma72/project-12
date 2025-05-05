// Existing sample data
export const sampleUsers = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "admin", department: "IT", joinDate: "2023-01-15" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "user", department: "Sales", joinDate: "2023-02-20" },
  { id: 3, name: "Michael Chen", email: "michael@example.com", role: "user", department: "Marketing", joinDate: "2023-03-10" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", role: "manager", department: "HR", joinDate: "2023-01-05" },
  { id: 5, name: "James Wilson", email: "james@example.com", role: "user", department: "Finance", joinDate: "2023-04-15" }
];

export const sampleProducts = [
  { id: 101, name: "Premium Widget", price: 299.99, stock: 50, category: "Electronics", rating: 4.5 },
  { id: 102, name: "Basic Package", price: 149.99, stock: 200, category: "Software", rating: 4.0 },
  { id: 103, name: "Deluxe Bundle", price: 499.99, stock: 25, category: "Electronics", rating: 4.8 },
  { id: 104, name: "Starter Kit", price: 99.99, stock: 150, category: "Software", rating: 3.9 },
  { id: 105, name: "Professional Suite", price: 799.99, stock: 30, category: "Software", rating: 4.7 }
];

export const sampleOrders = [
  { id: 1001, userId: 2, products: [101, 103], total: 799.98, status: "completed", date: "2024-01-15", paymentMethod: "credit_card" },
  { id: 1002, userId: 3, products: [102], total: 149.99, status: "pending", date: "2024-01-18", paymentMethod: "paypal" },
  { id: 1003, userId: 1, products: [101, 102], total: 449.98, status: "processing", date: "2024-01-20", paymentMethod: "credit_card" },
  { id: 1004, userId: 5, products: [104, 105], total: 899.98, status: "completed", date: "2024-01-22", paymentMethod: "bank_transfer" },
  { id: 1005, userId: 4, products: [103], total: 499.99, status: "completed", date: "2024-01-25", paymentMethod: "credit_card" }
];

export const sampleCustomerFeedback = [
  { id: 1, userId: 2, productId: 101, rating: 5, comment: "Excellent product!", date: "2024-01-16" },
  { id: 2, userId: 3, productId: 102, rating: 4, comment: "Good value for money", date: "2024-01-19" },
  { id: 3, userId: 4, productId: 103, rating: 5, comment: "Highly recommended!", date: "2024-01-26" },
  { id: 4, userId: 5, productId: 104, rating: 3, comment: "Decent but could be better", date: "2024-01-23" },
  { id: 5, userId: 1, productId: 105, rating: 4, comment: "Very useful features", date: "2024-01-21" }
];

export const sampleMarketingCampaigns = [
  { id: 1, name: "Spring Sale", budget: 5000, startDate: "2024-03-01", endDate: "2024-03-15", roi: 2.5 },
  { id: 2, name: "Summer Promotion", budget: 7500, startDate: "2024-06-01", endDate: "2024-06-30", roi: 1.8 },
  { id: 3, name: "Black Friday", budget: 10000, startDate: "2024-11-25", endDate: "2024-11-30", roi: 3.2 },
  { id: 4, name: "Holiday Special", budget: 8000, startDate: "2024-12-15", endDate: "2024-12-31", roi: 2.1 },
  { id: 5, name: "New Year Deal", budget: 6000, startDate: "2024-01-01", endDate: "2024-01-15", roi: 1.9 }
];

// New sample data
export const sampleGenomicSequences = [
  { id: "GS001", sequence: "ATCGATCGTAGCTAGCTAG", organism: "H. sapiens", chromosome: "1", position: 1000000, variation: "SNP", clinical_significance: "Pathogenic" },
  { id: "GS002", sequence: "GCTAGCTAGCTAGCTACGT", organism: "H. sapiens", chromosome: "2", position: 2000000, variation: "Deletion", clinical_significance: "Benign" },
  { id: "GS003", sequence: "CTAGCTAGCTAGCTACGTA", organism: "H. sapiens", chromosome: "3", position: 3000000, variation: "Insertion", clinical_significance: "Unknown" },
  { id: "GS004", sequence: "TAGCTAGCTAGCTACGTAA", organism: "H. sapiens", chromosome: "4", position: 4000000, variation: "SNP", clinical_significance: "Likely Pathogenic" },
  { id: "GS005", sequence: "AGCTAGCTAGCTACGTAAT", organism: "H. sapiens", chromosome: "5", position: 5000000, variation: "Deletion", clinical_significance: "Likely Benign" }
];

export const sampleLabResults = [
  { id: "LR001", patientId: "P001", test: "Complete Blood Count", result: "Normal", value: 12.5, unit: "g/dL", referenceRange: "12-16", date: "2024-01-10" },
  { id: "LR002", patientId: "P002", test: "Lipid Panel", result: "High", value: 220, unit: "mg/dL", referenceRange: "125-200", date: "2024-01-11" },
  { id: "LR003", patientId: "P003", test: "Glucose", result: "Normal", value: 95, unit: "mg/dL", referenceRange: "70-100", date: "2024-01-12" },
  { id: "LR004", patientId: "P004", test: "Thyroid Function", result: "Low", value: 0.8, unit: "mIU/L", referenceRange: "0.4-4.0", date: "2024-01-13" },
  { id: "LR005", patientId: "P005", test: "Liver Function", result: "Normal", value: 25, unit: "U/L", referenceRange: "7-56", date: "2024-01-14" }
];

export const sampleHousingData = [
  { id: "H001", location: "New York", type: "Apartment", price: 750000, sqft: 1000, bedrooms: 2, yearBuilt: 2010, lastSold: "2023-06-15" },
  { id: "H002", location: "Los Angeles", type: "House", price: 1200000, sqft: 2500, bedrooms: 4, yearBuilt: 2005, lastSold: "2023-07-20" },
  { id: "H003", location: "Chicago", type: "Condo", price: 450000, sqft: 800, bedrooms: 1, yearBuilt: 2015, lastSold: "2023-08-10" },
  { id: "H004", location: "Miami", type: "House", price: 950000, sqft: 3000, bedrooms: 5, yearBuilt: 2000, lastSold: "2023-09-05" },
  { id: "H005", location: "Seattle", type: "Townhouse", price: 850000, sqft: 1800, bedrooms: 3, yearBuilt: 2018, lastSold: "2023-10-15" }
];

export const sampleFinancialData = [
  { id: "F001", symbol: "AAPL", date: "2024-01-15", open: 185.34, high: 187.25, low: 184.56, close: 186.75, volume: 75000000 },
  { id: "F002", symbol: "GOOGL", date: "2024-01-15", open: 142.89, high: 144.56, low: 141.23, close: 143.45, volume: 25000000 },
  { id: "F003", symbol: "MSFT", date: "2024-01-15", open: 390.12, high: 392.45, low: 388.90, close: 391.50, volume: 30000000 },
  { id: "F004", symbol: "AMZN", date: "2024-01-15", open: 155.67, high: 157.89, low: 154.32, close: 156.78, volume: 40000000 },
  { id: "F005", symbol: "TSLA", date: "2024-01-15", open: 220.45, high: 225.67, low: 218.90, close: 222.34, volume: 50000000 }
];

export const samplePoliticalFunding = [
  { id: "PF001", candidate: "John Doe", party: "Party A", amount: 250000, donor: "PAC 1", date: "2024-01-05", type: "Individual" },
  { id: "PF002", candidate: "Jane Smith", party: "Party B", amount: 500000, donor: "Committee 2", date: "2024-01-08", type: "PAC" },
  { id: "PF003", candidate: "Bob Wilson", party: "Party A", amount: 150000, donor: "Organization 3", date: "2024-01-12", type: "Organization" },
  { id: "PF004", candidate: "Mary Johnson", party: "Party C", amount: 350000, donor: "PAC 4", date: "2024-01-15", type: "PAC" },
  { id: "PF005", candidate: "Steve Brown", party: "Party B", amount: 450000, donor: "Committee 5", date: "2024-01-18", type: "Committee" }
];

export const generateSampleDatasets = () => {
  const usersDataset = {
    id: 'sample-users',
    name: 'Users Dataset',
    description: 'Sample user data for analysis including roles and departments',
    rows: sampleUsers.length,
    columns: 5,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '2.5 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'name', 'email', 'role', 'department', 'joinDate'],
      rows: sampleUsers.map(user => [
        user.id.toString(),
        user.name,
        user.email,
        user.role,
        user.department,
        user.joinDate
      ])
    }
  };

  const productsDataset = {
    id: 'sample-products',
    name: 'Products Dataset',
    description: 'Sample product catalog data with categories and ratings',
    rows: sampleProducts.length,
    columns: 6,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '1.8 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'name', 'price', 'stock', 'category', 'rating'],
      rows: sampleProducts.map(product => [
        product.id.toString(),
        product.name,
        product.price.toString(),
        product.stock.toString(),
        product.category,
        product.rating.toString()
      ])
    }
  };

  const ordersDataset = {
    id: 'sample-orders',
    name: 'Orders Dataset',
    description: 'Sample order transaction data with payment methods',
    rows: sampleOrders.length,
    columns: 7,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '3.2 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'userId', 'products', 'total', 'status', 'date', 'paymentMethod'],
      rows: sampleOrders.map(order => [
        order.id.toString(),
        order.userId.toString(),
        JSON.stringify(order.products),
        order.total.toString(),
        order.status,
        order.date,
        order.paymentMethod
      ])
    }
  };

  const feedbackDataset = {
    id: 'sample-feedback',
    name: 'Customer Feedback',
    description: 'Customer ratings and reviews for products',
    rows: sampleCustomerFeedback.length,
    columns: 5,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '2.1 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'userId', 'productId', 'rating', 'comment', 'date'],
      rows: sampleCustomerFeedback.map(feedback => [
        feedback.id.toString(),
        feedback.userId.toString(),
        feedback.productId.toString(),
        feedback.rating.toString(),
        feedback.comment,
        feedback.date
      ])
    }
  };

  const campaignsDataset = {
    id: 'sample-campaigns',
    name: 'Marketing Campaigns',
    description: 'Marketing campaign performance data',
    rows: sampleMarketingCampaigns.length,
    columns: 6,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '1.9 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'name', 'budget', 'startDate', 'endDate', 'roi'],
      rows: sampleMarketingCampaigns.map(campaign => [
        campaign.id.toString(),
        campaign.name,
        campaign.budget.toString(),
        campaign.startDate,
        campaign.endDate,
        campaign.roi.toString()
      ])
    }
  };

  const genomicDataset = {
    id: 'sample-genomic',
    name: 'Genomic Sequences',
    description: 'Sample genomic sequence data with variations and clinical significance',
    rows: sampleGenomicSequences.length,
    columns: 7,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '4.5 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'sequence', 'organism', 'chromosome', 'position', 'variation', 'clinical_significance'],
      rows: sampleGenomicSequences.map(seq => [
        seq.id,
        seq.sequence,
        seq.organism,
        seq.chromosome,
        seq.position.toString(),
        seq.variation,
        seq.clinical_significance
      ])
    }
  };

  const labResultsDataset = {
    id: 'sample-lab-results',
    name: 'Laboratory Results',
    description: 'Clinical laboratory test results with reference ranges',
    rows: sampleLabResults.length,
    columns: 7,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '2.8 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'patientId', 'test', 'result', 'value', 'unit', 'referenceRange', 'date'],
      rows: sampleLabResults.map(result => [
        result.id,
        result.patientId,
        result.test,
        result.result,
        result.value.toString(),
        result.unit,
        result.referenceRange,
        result.date
      ])
    }
  };

  const housingDataset = {
    id: 'sample-housing',
    name: 'Housing Market Data',
    description: 'Real estate market data including prices and property details',
    rows: sampleHousingData.length,
    columns: 8,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '3.1 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'location', 'type', 'price', 'sqft', 'bedrooms', 'yearBuilt', 'lastSold'],
      rows: sampleHousingData.map(house => [
        house.id,
        house.location,
        house.type,
        house.price.toString(),
        house.sqft.toString(),
        house.bedrooms.toString(),
        house.yearBuilt.toString(),
        house.lastSold
      ])
    }
  };

  const financialDataset = {
    id: 'sample-financial',
    name: 'Stock Market Data',
    description: 'Daily stock market performance data for major companies',
    rows: sampleFinancialData.length,
    columns: 7,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '2.9 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'symbol', 'date', 'open', 'high', 'low', 'close', 'volume'],
      rows: sampleFinancialData.map(stock => [
        stock.id,
        stock.symbol,
        stock.date,
        stock.open.toString(),
        stock.high.toString(),
        stock.low.toString(),
        stock.close.toString(),
        stock.volume.toString()
      ])
    }
  };

  const politicalFundingDataset = {
    id: 'sample-political',
    name: 'Political Fundraising',
    description: 'Campaign finance data including donations and sources',
    rows: samplePoliticalFunding.length,
    columns: 7,
    dateUploaded: new Date().toISOString(),
    fileType: 'json',
    fileSize: '2.4 KB',
    projectId: '1',
    previewData: {
      columns: ['id', 'candidate', 'party', 'amount', 'donor', 'date', 'type'],
      rows: samplePoliticalFunding.map(funding => [
        funding.id,
        funding.candidate,
        funding.party,
        funding.amount.toString(),
        funding.donor,
        funding.date,
        funding.type
      ])
    }
  };

  return [
    usersDataset,
    productsDataset,
    ordersDataset,
    feedbackDataset,
    campaignsDataset,
    genomicDataset,
    labResultsDataset,
    housingDataset,
    financialDataset,
    politicalFundingDataset
  ];
};