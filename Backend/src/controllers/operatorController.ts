import { Request, Response } from 'express';
import { ResultSetHeader } from 'mysql2';
import connection from '../config/db';
import { ResponseSuccess } from '../model/Response/responseSuccess';

export const createOperator = (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name){
    console.error('Insert name');
    res.status(400).json({ message: 'name required' });
    return;
  };

  const query = "INSERT INTO operator (nama_operator) VALUES (?)";
  connection.query(query, [name], (err, results) => {
    if (err){
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    const response: ResponseSuccess = {
      message: 'success',
      data: results
    }
    return res.status(201).json(response);
  });
};

export const getOperators = (req: Request, res: Response) => {
  const query = "SELECT * FROM operator WHERE deleted_at IS NULL";

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const response: ResponseSuccess = {
      message: 'success',
      data: results
    }
    return res.status(200).json(response);
  });
};

export const updateOperator = (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: 'name required' });
    return;
  }

  const query = "UPDATE operator SET nama_operator = ? WHERE id_operator = ? AND deleted_at IS NULL";
  connection.query(query, [name, id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const result = results as ResultSetHeader;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Operator not found' });
    }

    const response: ResponseSuccess = {
      message: 'success',
      data: results
    }
    return res.status(200).json({ response });
  });
};

export const deleteOperator = (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'Invalid Request' });
    return;
  }

  const query = "UPDATE operator SET deleted_at = NOW() WHERE id_operator = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const result = results as ResultSetHeader;
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Operator not found' });
      
    }

    return res.status(200).json({ message: 'success' });
  });
};