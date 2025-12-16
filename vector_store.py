"""
FAISS Vector Store - Embedding Storage and Similarity Search
"""
import faiss
import numpy as np
import pickle
import os
from typing import List, Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class FAISSVectorStore:
    """FAISS-based vector storage and search"""
    
    def __init__(self, dimension: int = 1536, index_path: str = "./data/faiss_indices"):
        """
        Initialize FAISS vector store
        
        Args:
            dimension: Embedding dimension (1536 for text-embedding-3-small)
            index_path: Directory to save/load indices
        """
        self.dimension = dimension
        self.index_path = index_path
        os.makedirs(index_path, exist_ok=True)
        
        # Create FAISS index (using IndexFlatIP for inner product/cosine similarity)
        self.index = faiss.IndexFlatIP(dimension)
        
        # Metadata storage (maps index position to chunk data)
        self.id_to_metadata = {}
        self.metadata_to_id = {}
        self.next_id = 0
    
    def add_embeddings(self, embeddings: np.ndarray, metadata: List[Dict]) -> List[int]:
        """
        Add embeddings to the index
        
        Args:
            embeddings: Numpy array of shape (n, dimension)
            metadata: List of metadata dicts for each embedding
        
        Returns:
            List of assigned IDs
        """
        # Normalize embeddings for cosine similarity
        faiss.normalize_L2(embeddings)
        
        # Add to FAISS index
        start_id = self.next_id
        self.index.add(embeddings)
        
        # Store metadata
        ids = []
        for i, meta in enumerate(metadata):
            id_val = start_id + i
            self.id_to_metadata[id_val] = meta
            self.metadata_to_id[meta['id']] = id_val
            ids.append(id_val)
        
        self.next_id += len(embeddings)
        
        logger.info(f"Added {len(embeddings)} embeddings to index. Total: {self.index.ntotal}")
        return ids
    
    def search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 10,
        document_ids: Optional[List[str]] = None
    ) -> List[Dict]:
        """
        Search for similar embeddings
        
        Args:
            query_embedding: Query vector of shape (1, dimension)
            top_k: Number of results to return
            document_ids: Filter by document IDs (optional)
        
        Returns:
            List of results with metadata and scores
        """
        if self.index.ntotal == 0:
            logger.warning("Index is empty")
            return []
        
        # Normalize query
        query_embedding = query_embedding.reshape(1, -1)
        faiss.normalize_L2(query_embedding)
        
        # Search (get more than top_k for filtering)
        search_k = min(top_k * 3, self.index.ntotal) if document_ids else top_k
        scores, indices = self.index.search(query_embedding, search_k)
        
        # Build results
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for invalid indices
                continue
            
            metadata = self.id_to_metadata.get(idx, {})
            
            # Filter by document_ids if specified
            if document_ids and metadata.get('document_id') not in document_ids:
                continue
            
            results.append({
                **metadata,
                'score': float(score),
                'faiss_id': int(idx)
            })
            
            if len(results) >= top_k:
                break
        
        return results
    
    def get_embedding(self, chunk_id: str) -> Optional[np.ndarray]:
        """Get embedding vector for a chunk ID"""
        faiss_id = self.metadata_to_id.get(chunk_id)
        if faiss_id is None:
            return None
        
        # FAISS doesn't support direct retrieval, so we reconstruct
        # This is a limitation - in production, store embeddings separately
        return None
    
    def delete_by_document_id(self, document_id: str):
        """
        Delete all embeddings for a document
        Note: FAISS doesn't support deletion, so we need to rebuild index
        """
        # Filter out embeddings for this document
        keep_ids = [
            idx for idx, meta in self.id_to_metadata.items()
            if meta.get('document_id') != document_id
        ]
        
        if len(keep_ids) == len(self.id_to_metadata):
            logger.info(f"No embeddings found for document {document_id}")
            return
        
        logger.warning(f"Rebuilding index to remove document {document_id}")
        
        # Create new index
        new_index = faiss.IndexFlatIP(self.dimension)
        new_id_to_metadata = {}
        new_metadata_to_id = {}
        
        # This would require re-embedding, which we can't do here
        # In production, store embeddings separately or use a database that supports deletion
        
        logger.error("FAISS deletion requires re-indexing with original embeddings")
        raise NotImplementedError("FAISS deletion not implemented - use Milvus or Qdrant for production")
    
    def save_index(self, name: str = "default"):
        """Save index and metadata to disk"""
        index_file = os.path.join(self.index_path, f"{name}.index")
        metadata_file = os.path.join(self.index_path, f"{name}.meta")
        
        # Save FAISS index
        faiss.write_index(self.index, index_file)
        
        # Save metadata
        with open(metadata_file, 'wb') as f:
            pickle.dump({
                'id_to_metadata': self.id_to_metadata,
                'metadata_to_id': self.metadata_to_id,
                'next_id': self.next_id
            }, f)
        
        logger.info(f"Saved index to {index_file}")
    
    def load_index(self, name: str = "default") -> bool:
        """Load index and metadata from disk"""
        index_file = os.path.join(self.index_path, f"{name}.index")
        metadata_file = os.path.join(self.index_path, f"{name}.meta")
        
        if not os.path.exists(index_file) or not os.path.exists(metadata_file):
            logger.warning(f"Index files not found: {name}")
            return False
        
        # Load FAISS index
        self.index = faiss.read_index(index_file)
        
        # Load metadata
        with open(metadata_file, 'rb') as f:
            data = pickle.load(f)
            self.id_to_metadata = data['id_to_metadata']
            self.metadata_to_id = data['metadata_to_id']
            self.next_id = data['next_id']
        
        logger.info(f"Loaded index from {index_file}. Total vectors: {self.index.ntotal}")
        return True
    
    def get_stats(self) -> Dict:
        """Get index statistics"""
        return {
            'total_vectors': self.index.ntotal,
            'dimension': self.dimension,
            'index_type': 'IndexFlatIP',
            'documents': len(set(
                meta.get('document_id') for meta in self.id_to_metadata.values()
            ))
        }


# Singleton instance
vector_store = None

def get_vector_store(dimension: int = 1536, index_path: str = "./data/faiss_indices") -> FAISSVectorStore:
    """Get or create vector store instance"""
    global vector_store
    if vector_store is None:
        vector_store = FAISSVectorStore(dimension, index_path)
        # Try to load existing index
        vector_store.load_index()
    return vector_store
