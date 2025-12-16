"""
SQLite Database Layer - SQLAlchemy Models and Operations
"""
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import List, Optional, Dict
import json

Base = declarative_base()


# Models
class Document(Base):
    """Document metadata table"""
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True)
    filename = Column(String, nullable=False)
    file_type = Column(String)  # pdf, docx, csv, txt
    document_type = Column(String)  # policy, claims, contract, general
    upload_date = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)
    status = Column(String)  # uploaded, processing, indexed, error
    file_path = Column(String)
    file_size = Column(Integer)
    metadata = Column(JSON)


class Chunk(Base):
    """Document chunks table"""
    __tablename__ = "chunks"
    
    id = Column(String, primary_key=True)
    document_id = Column(String, nullable=False)
    chunk_index = Column(Integer)
    text = Column(Text)
    enriched_text = Column(Text)  # with context prepended
    tokens = Column(Integer)
    embedding_id = Column(String)  # FAISS index ID
    quality_score = Column(Float)
    section = Column(String)


class Entity(Base):
    """Extracted entities table"""
    __tablename__ = "entities"
    
    id = Column(String, primary_key=True)
    name = Column(String)
    entity_type = Column(String)  # person, date, amount, organization
    value = Column(String)
    confidence = Column(Float)
    document_id = Column(String)
    chunk_id = Column(String)


class ChatHistory(Base):
    """Conversation history table"""
    __tablename__ = "chat_history"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=False)
    turn_number = Column(Integer)
    role = Column(String)  # user, assistant
    message = Column(Text)
    context_used = Column(JSON)  # which chunks were used
    timestamp = Column(DateTime, default=datetime.utcnow)
    model = Column(String)
    tokens_input = Column(Integer)
    tokens_output = Column(Integer)


class QueryLog(Base):
    """Query execution logs"""
    __tablename__ = "query_logs"
    
    id = Column(String, primary_key=True)
    query = Column(Text)
    approach = Column(String)  # standard, truecontext
    model = Column(String)
    document_ids = Column(JSON)
    response = Column(Text)
    quality_score = Column(Float)
    quality_breakdown = Column(JSON)
    tokens_input = Column(Integer)
    tokens_output = Column(Integer)
    cost = Column(Float)
    latency = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ComparisonResult(Base):
    """Side-by-side comparison results"""
    __tablename__ = "comparison_results"
    
    id = Column(String, primary_key=True)
    query = Column(Text)
    standard_response = Column(Text)
    truecontext_response = Column(Text)
    standard_metrics = Column(JSON)
    truecontext_metrics = Column(JSON)
    winner = Column(String)  # standard, truecontext, tie
    timestamp = Column(DateTime, default=datetime.utcnow)


# Database Manager
class DatabaseManager:
    """SQLite database operations manager"""
    
    def __init__(self, database_url: str = "sqlite:///./truecontext.db"):
        self.engine = create_engine(database_url, echo=False)
        self.SessionLocal = sessionmaker(bind=self.engine)
        Base.metadata.create_all(self.engine)
    
    def get_session(self) -> Session:
        """Get database session"""
        return self.SessionLocal()
    
    # Document CRUD
    def create_document(self, doc_data: Dict) -> Document:
        """Create new document record"""
        session = self.get_session()
        try:
            doc = Document(**doc_data)
            session.add(doc)
            session.commit()
            session.refresh(doc)
            return doc
        finally:
            session.close()
    
    def get_document(self, doc_id: str) -> Optional[Document]:
        """Get document by ID"""
        session = self.get_session()
        try:
            return session.query(Document).filter(Document.id == doc_id).first()
        finally:
            session.close()
    
    def list_documents(self, limit: int = 100) -> List[Document]:
        """List all documents"""
        session = self.get_session()
        try:
            return session.query(Document).order_by(Document.upload_date.desc()).limit(limit).all()
        finally:
            session.close()
    
    def update_document_status(self, doc_id: str, status: str, processed: bool = False):
        """Update document processing status"""
        session = self.get_session()
        try:
            doc = session.query(Document).filter(Document.id == doc_id).first()
            if doc:
                doc.status = status
                doc.processed = processed
                session.commit()
        finally:
            session.close()
    
    def delete_document(self, doc_id: str):
        """Delete document and related data"""
        session = self.get_session()
        try:
            # Delete chunks
            session.query(Chunk).filter(Chunk.document_id == doc_id).delete()
            # Delete entities
            session.query(Entity).filter(Entity.document_id == doc_id).delete()
            # Delete document
            session.query(Document).filter(Document.id == doc_id).delete()
            session.commit()
        finally:
            session.close()
    
    # Chunk CRUD
    def create_chunks(self, chunks_data: List[Dict]) -> List[Chunk]:
        """Batch create chunks"""
        session = self.get_session()
        try:
            chunks = [Chunk(**chunk_data) for chunk_data in chunks_data]
            session.bulk_save_objects(chunks)
            session.commit()
            return chunks
        finally:
            session.close()
    
    def get_chunks_by_document(self, doc_id: str) -> List[Chunk]:
        """Get all chunks for a document"""
        session = self.get_session()
        try:
            return session.query(Chunk).filter(Chunk.document_id == doc_id).order_by(Chunk.chunk_index).all()
        finally:
            session.close()
    
    # Entity CRUD
    def create_entities(self, entities_data: List[Dict]) -> List[Entity]:
        """Batch create entities"""
        session = self.get_session()
        try:
            entities = [Entity(**entity_data) for entity_data in entities_data]
            session.bulk_save_objects(entities)
            session.commit()
            return entities
        finally:
            session.close()
    
    # Chat History
    def create_chat_message(self, message_data: Dict) -> ChatHistory:
        """Create chat message"""
        session = self.get_session()
        try:
            message = ChatHistory(**message_data)
            session.add(message)
            session.commit()
            session.refresh(message)
            return message
        finally:
            session.close()
    
    def get_chat_history(self, session_id: str, limit: int = 10) -> List[ChatHistory]:
        """Get chat history for session"""
        session = self.get_session()
        try:
            return session.query(ChatHistory)\
                .filter(ChatHistory.session_id == session_id)\
                .order_by(ChatHistory.turn_number.desc())\
                .limit(limit)\
                .all()
        finally:
            session.close()
    
    # Query Logs
    def create_query_log(self, log_data: Dict) -> QueryLog:
        """Create query log"""
        session = self.get_session()
        try:
            log = QueryLog(**log_data)
            session.add(log)
            session.commit()
            session.refresh(log)
            return log
        finally:
            session.close()
    
    def get_query_logs(self, limit: int = 50) -> List[QueryLog]:
        """Get recent query logs"""
        session = self.get_session()
        try:
            return session.query(QueryLog).order_by(QueryLog.timestamp.desc()).limit(limit).all()
        finally:
            session.close()
    
    # Comparison Results
    def create_comparison(self, comparison_data: Dict) -> ComparisonResult:
        """Create comparison result"""
        session = self.get_session()
        try:
            comparison = ComparisonResult(**comparison_data)
            session.add(comparison)
            session.commit()
            session.refresh(comparison)
            return comparison
        finally:
            session.close()


# Singleton instance
db_manager = None

def get_db_manager(database_url: str = "sqlite:///./truecontext.db") -> DatabaseManager:
    """Get or create database manager instance"""
    global db_manager
    if db_manager is None:
        db_manager = DatabaseManager(database_url)
    return db_manager
